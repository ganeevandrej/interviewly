import 'server-only';
import { randomUUID } from 'node:crypto';

import type { Prisma } from '../generated/prisma/client';
import { getDb } from './db';
import { InputError, projectCreateInput, projectUpdateInput, text } from './validation';
import type { Project } from '@/types';

const projectInclude = {
  technologies: { include: { technology: true }, orderBy: { technology: { name: 'asc' } } },
  questions: { include: { question: true }, orderBy: { questionId: 'asc' } },
  tags: { include: { tag: { include: { stories: { include: { story: true } } } } } },
} satisfies Prisma.ProjectInclude;

type ProjectPayload = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function serializeProject(project: ProjectPayload) {
  const { technologies, questions, tags, ...data } = project;

  return {
    ...data,
    color: data.color ?? '#6c63ff',
    team: (Array.isArray(data.team) ? data.team : []) as Project['team'],
    tasks: (Array.isArray(data.tasks) ? data.tasks : []) as Project['tasks'],
    responsibilities: (Array.isArray(data.responsibilities) ? data.responsibilities : []) as Project['responsibilities'],
    achievements: (Array.isArray(data.achievements) ? data.achievements : []) as Project['achievements'],
    technologies: technologies.map(({ technology, isFeatured }) => ({ ...technology, isFeatured })),
    questions: questions.map(({ question }) => question),
    tag: tags.find(({ isAutoCreated }) => isAutoCreated)?.tag ?? null,
    histories: tags.flatMap(({ tag }) => tag.stories.map(({ story }) => story)) as Project['histories'],
  };
}

const completeProjectFields = [
  'title',
  'color',
  'description',
  'team',
  'tasks',
  'responsibilities',
  'achievements',
  'technologies',
] as const;

function assertReady(data: ReturnType<typeof projectUpdateInput>) {
  for (const field of completeProjectFields) {
    const value = data[field];
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0))
      throw new InputError(`Для статуса READY заполните поле «${field}».`);
  }
}

async function syncProjectTag(tx: Prisma.TransactionClient, projectId: string, title: string) {
  const link = await tx.projectTag.findFirst({ where: { projectId, isAutoCreated: true } });
  if (link) {
    await tx.tag.update({ where: { id: link.tagId }, data: { name: title } });
    return;
  }

  const tag = await tx.tag.upsert({
    where: { name: title },
    update: {},
    create: { id: randomUUID(), name: title },
  });
  await tx.projectTag.create({ data: { projectId, tagId: tag.id, isAutoCreated: true } });
}

async function saveTechnologies(
  tx: Prisma.TransactionClient,
  projectId: string,
  technologies: NonNullable<ReturnType<typeof projectUpdateInput>['technologies']>,
) {
  await tx.projectTechnology.deleteMany({ where: { projectId } });

  const uniqueTechnologies = technologies.filter(
    (item, index, items) =>
      items.findIndex((candidate) => (candidate.id ?? candidate.name) === (item.id ?? item.name)) ===
      index,
  );

  for (const item of uniqueTechnologies) {
    const technology = item.id
      ? await tx.technology.findUnique({ where: { id: item.id } })
      : await tx.technology.upsert({
          where: { name: item.name! },
          update: {},
          create: { id: randomUUID(), name: item.name! },
        });

    if (!technology) throw new InputError('Технология не найдена.', 404);

    await tx.projectTechnology.create({
      data: { projectId, technologyId: technology.id, isFeatured: item.isFeatured },
    });
  }
}

export async function listProjects() {
  const projects = await getDb().project.findMany({
    orderBy: [{ status: 'desc' }, { title: 'asc' }, { id: 'asc' }],
    include: projectInclude,
  });
  return projects.map(serializeProject);
}

export async function readProject(projectId: string) {
  const project = await getDb().project.findUnique({
    where: { id: text(projectId, 'Проект') },
    include: projectInclude,
  });
  if (!project) throw new InputError('Проект не найден.', 404);
  return serializeProject(project);
}

export async function createProject(input: unknown) {
  const data = projectCreateInput(input);
  const project = await getDb().$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        id: randomUUID(),
        title: data.title,
        color: data.color,
        description: data.description,
        team: data.team,
        tasks: data.tasks,
        responsibilities: data.responsibilities,
        achievements: data.achievements,
      },
    });
    await syncProjectTag(tx, project.id, project.title);
    if (data.technologies) await saveTechnologies(tx, project.id, data.technologies);
    return tx.project.findUniqueOrThrow({ where: { id: project.id }, include: projectInclude });
  }, { maxWait: 10000, timeout: 15000 });
  return serializeProject(project);
}

export async function updateProject(projectId: string, input: unknown) {
  const id = text(projectId, 'Проект');
  const data = projectUpdateInput(input);
  if (data.status === 'READY') assertReady(data);

  const project = await getDb().$transaction(async (tx) => {
    const current = await tx.project.findUnique({ where: { id } });
    if (!current) throw new InputError('Проект не найден.', 404);
    await tx.project.update({
      where: { id },
      data: {
        title: data.title,
        color: data.color,
        description: data.description,
        team: data.team,
        tasks: data.tasks,
        responsibilities: data.responsibilities,
        achievements: data.achievements,
        status: data.status === 'READY' ? 'READY' : 'DRAFT',
      },
    });
    if (current.title !== data.title) await syncProjectTag(tx, id, data.title);
    if (data.technologies) await saveTechnologies(tx, id, data.technologies);
    return tx.project.findUniqueOrThrow({ where: { id }, include: projectInclude });
  }, { maxWait: 10000, timeout: 15000 });
  return serializeProject(project);
}

export async function deleteProject(projectId: string) {
  const id = text(projectId, 'Проект');
  await getDb().$transaction(async (tx) => {
    const links = await tx.projectTag.findMany({
      where: { projectId: id, isAutoCreated: true },
      select: { tagId: true },
    });
    await tx.project.delete({ where: { id } });
    if (links.length)
      await tx.tag.deleteMany({ where: { id: { in: links.map(({ tagId }) => tagId) } } });
  });
}

export async function addProjectQuestion(projectId: string, questionId: string) {
  const id = text(projectId, 'Проект');
  const question = text(questionId, 'Вопрос');
  await getDb().$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id } });
    if (!project) throw new InputError('Проект не найден.', 404);
    const exists = await tx.question.findUnique({ where: { id: question } });
    if (!exists) throw new InputError('Вопрос не найден.', 404);
    await tx.projectQuestion.create({ data: { projectId: id, questionId: question } });
  });
  return readProject(id);
}

export async function removeProjectQuestion(projectId: string, questionId: string) {
  await getDb().projectQuestion.delete({
    where: {
      projectId_questionId: {
        projectId: text(projectId, 'Проект'),
        questionId: text(questionId, 'Вопрос'),
      },
    },
  });
}
