import 'server-only';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../generated/prisma/client';
import { getDb } from './db';
import { InputError, groupInput, topicInput, questionInput, text } from './validation';

const groupInclude = {
  topics: {
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }, { id: 'asc' }],
    include: { questions: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
  },
} satisfies Prisma.QuestionGroupInclude;

export function listGroups() {
  return getDb().questionGroup.findMany({
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
    include: groupInclude,
  });
}
export async function readGroup(groupId: string) {
  const group = await getDb().questionGroup.findUnique({
    where: { id: text(groupId, 'Группа') },
    include: groupInclude,
  });
  if (!group) throw new InputError('Группа не найдена.', 404);
  return group;
}

export function createGroup(input: unknown) {
  const data = groupInput(input);
  return getDb().questionGroup.create({
    data: {
      ...data,
      id: randomUUID(),
      topics: {
        create: { id: randomUUID(), name: 'Без темы', isDefault: true },
      },
    },
    include: groupInclude,
  });
}

// Serialize writes within one group. In particular, deleting a topic must not race
// with question creation/movement, because the topic FK cascades deletes.
async function inGroup<T>(
  groupId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  const id = text(groupId, 'Группа');
  return getDb().$transaction(
    async (tx) => {
      const rows = await tx.$queryRaw<
        { id: string }[]
      >`SELECT "id" FROM "QuestionGroup" WHERE "id" = ${id} FOR UPDATE`;
      if (!rows.length) throw new InputError('Группа не найдена.', 404);
      return operation(tx);
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

async function findTopic(tx: Prisma.TransactionClient, groupId: string, topicId: string) {
  const topic = await tx.topic.findFirst({ where: { id: text(topicId, 'Тема'), groupId } });
  if (!topic) throw new InputError('Тема не найдена в этой группе.', 404);
  return topic;
}

async function defaultTopic(tx: Prisma.TransactionClient, groupId: string) {
  const topic = await tx.topic.findFirst({ where: { groupId, isDefault: true } });
  if (!topic) throw new InputError('В группе отсутствует системная тема.', 409);
  return topic;
}

async function nextPosition(tx: Prisma.TransactionClient, topicId: string) {
  const result = await tx.question.aggregate({ where: { topicId }, _max: { position: true } });
  return (result._max.position ?? -1) + 1;
}

async function findQuestion(tx: Prisma.TransactionClient, groupId: string, questionId: string) {
  const question = await tx.question.findFirst({
    where: { id: text(questionId, 'Вопрос'), topic: { groupId } },
  });
  if (!question) throw new InputError('Вопрос не найден в этой группе.', 404);
  return question;
}

export function updateGroup(groupId: string, input: unknown) {
  const data = groupInput(input);
  return inGroup(groupId, (tx) => tx.questionGroup.update({ where: { id: groupId }, data }));
}

export function deleteGroup(groupId: string) {
  return inGroup(groupId, async (tx) => {
    await tx.questionGroup.delete({ where: { id: groupId } });
  });
}

export function createTopic(groupId: string, input: unknown) {
  const data = topicInput(input);
  return inGroup(groupId, (tx) =>
    tx.topic.create({ data: { ...data, id: randomUUID(), groupId } }),
  );
}

export function updateTopic(groupId: string, topicId: string, input: unknown) {
  const data = topicInput(input);
  return inGroup(groupId, async (tx) => {
    const topic = await findTopic(tx, groupId, topicId);
    if (topic.isDefault) throw new InputError('Системную тему нельзя переименовать.', 409);
    return tx.topic.update({ where: { id: topic.id }, data });
  });
}

export function deleteTopic(groupId: string, topicId: string) {
  return inGroup(groupId, async (tx) => {
    const topic = await findTopic(tx, groupId, topicId);
    if (topic.isDefault) throw new InputError('Системную тему нельзя удалить.', 409);
    const target = await defaultTopic(tx, groupId);
    const position = await nextPosition(tx, target.id);
    // Move the whole topic in one query, keeping the original order after existing questions.
    await tx.$executeRaw`
      WITH ordered AS (
        SELECT "id", row_number() OVER (ORDER BY "position", "id") - 1 AS offset
        FROM "Question" WHERE "topicId" = ${topic.id}
      )
      UPDATE "Question" AS q
      SET "topicId" = ${target.id}, "position" = (${position} + ordered.offset)::integer
      FROM ordered WHERE q."id" = ordered."id"
    `;
    await tx.topic.delete({ where: { id: topic.id } });
  });
}

export function createQuestion(groupId: string, input: unknown) {
  const data = questionInput(input);
  return inGroup(groupId, async (tx) => {
    const topic =
      data.topicId === null
        ? await defaultTopic(tx, groupId)
        : await findTopic(tx, groupId, data.topicId);
    return tx.question.create({
      data: {
        ...data,
        id: randomUUID(),
        topicId: topic.id,
        position: await nextPosition(tx, topic.id),
      },
    });
  });
}

export function updateQuestion(groupId: string, questionId: string, input: unknown) {
  const data = questionInput(input);
  return inGroup(groupId, async (tx) => {
    const question = await findQuestion(tx, groupId, questionId);
    const topic =
      data.topicId === null
        ? await defaultTopic(tx, groupId)
        : await findTopic(tx, groupId, data.topicId);
    return tx.question.update({
      where: { id: question.id },
      data: {
        ...data,
        topicId: topic.id,
        position:
          question.topicId === topic.id ? question.position : await nextPosition(tx, topic.id),
      },
    });
  });
}

export function deleteQuestion(groupId: string, questionId: string) {
  return inGroup(groupId, async (tx) => {
    const question = await findQuestion(tx, groupId, questionId);
    await tx.question.delete({ where: { id: question.id } });
  });
}
