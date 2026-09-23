import 'server-only';
import { randomUUID } from 'node:crypto';

import type { Prisma } from '../generated/prisma/client';
import { getDb } from './db';
import { InputError, storyCreateInput, storyUpdateInput, text } from './validation';

const storyInclude = {
  tags: { include: { tag: true }, orderBy: { tag: { name: 'asc' } } },
  questions: {
    include: { question: { include: { topic: { select: { groupId: true } } } } },
    orderBy: { questionId: 'asc' },
  },
} satisfies Prisma.StoryInclude;

function serializeStory(story: Prisma.StoryGetPayload<{ include: typeof storyInclude }>) {
  const { tags, questions, ...data } = story;
  return {
    ...data,
    tags: tags.map(({ tag }) => tag),
    questions: questions.map(({ question }) => ({
      id: question.id,
      question: question.question,
      groupId: question.topic.groupId,
    })),
  };
}

export async function listStories() {
  const stories = await getDb().story.findMany({
    orderBy: [{ title: 'asc' }, { id: 'asc' }],
    include: storyInclude,
  });
  return stories.map(serializeStory);
}

export async function readStory(storyId: string) {
  const story = await getDb().story.findUnique({
    where: { id: text(storyId, 'История') },
    include: storyInclude,
  });
  if (!story) throw new InputError('История не найдена.', 404);

  return serializeStory(story);
}

export async function createStory(input: unknown) {
  const data = storyCreateInput(input);
  const story = await getDb().$transaction(async (tx) => {
    const questions = data.questionIds.length
      ? await tx.question.findMany({
          where: { id: { in: data.questionIds } },
          select: { id: true },
        })
      : [];
    if (questions.length !== data.questionIds.length)
      throw new InputError('Один или несколько вопросов не найдены.', 404);

    return tx.story.create({
      data: {
        id: randomUUID(),
        title: data.title,
        context: data.context,
        problem: data.problem,
        responsibility: data.responsibility,
        solution: data.solution,
        difficulties: data.difficulties,
        learned: data.learned,
        additionalQuestions: data.additionalQuestions,
        tags: {
          create: data.tags.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { id: randomUUID(), name } } },
          })),
        },
        questions: {
          create: data.questionIds.map((questionId) => ({
            question: { connect: { id: questionId } },
          })),
        },
      },
      include: storyInclude,
    });
  });
  return serializeStory(story);
}

export async function updateStory(storyId: string, input: unknown) {
  const id = text(storyId, 'История');
  const data = storyUpdateInput(input);
  const story = await getDb().$transaction(async (tx) => {
    await tx.storyTag.deleteMany({ where: { storyId: id } });
    await tx.storyQuestion.deleteMany({ where: { storyId: id } });
    return tx.story.update({
      where: { id },
      data: {
        title: data.title,
        context: data.context,
        problem: data.problem,
        responsibility: data.responsibility,
        solution: data.solution,
        difficulties: data.difficulties,
        learned: data.learned,
        additionalQuestions: data.additionalQuestions,
        tags: {
          create: data.tags.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { id: randomUUID(), name } } },
          })),
        },
        questions: {
          create: data.questionIds.map((questionId) => ({
            question: { connect: { id: questionId } },
          })),
        },
      },
      include: storyInclude,
    });
  });
  return serializeStory(story);
}

export async function deleteStory(storyId: string) {
  await getDb().story.delete({ where: { id: text(storyId, 'История') } });
}
