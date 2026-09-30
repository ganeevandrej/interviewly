import 'server-only';
import { randomUUID } from 'node:crypto';

import { Prisma } from '../generated/prisma/client';

import { getDb } from './db';
import { categoryInput, InputError, questionInput, text, topicInput } from './validation';

const categoryInclude = {
    topics: {
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        include: { questions: { orderBy: [{ position: 'asc' }, { questionId: 'asc' }] } },
    },
    questions: {
        orderBy: [{ position: 'asc' }, { questionId: 'asc' }],
        include: { question: true },
    },
} satisfies Prisma.CategoryInclude;

type CategoryPayload = Prisma.CategoryGetPayload<{ include: typeof categoryInclude }>;

function serializeCategory(category: CategoryPayload) {
    const { topics, questions, ...data } = category;

    return {
        category: data,
        topics: topics.map((topic) => ({
            id: topic.id,
            categoryId: topic.categoryId,
            name: topic.name,
        })),
        questions: questions.map(({ question }) => question),
        categoryQuestions: questions.map(({ categoryId, questionId, position }) => ({
            categoryId,
            questionId,
            position,
        })),
        topicQuestions: topics.flatMap(({ questions: topicQuestions }) => topicQuestions),
    };
}

export function listCategories() {
    return getDb().category.findMany({
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        select: { id: true, name: true, accentColor: true },
    });
}

export async function readCategory(categoryId: string) {
    const category = await getDb().category.findUnique({
        where: { id: text(categoryId, 'Категория') },
        include: categoryInclude,
    });

    if (!category) throw new InputError('Категория не найдена.', 404);

    return serializeCategory(category);
}

export function createCategory(input: unknown) {
    const data = categoryInput(input);

    return getDb().category.create({ data: { ...data, id: randomUUID() } });
}

async function inCategory<T>(
    categoryId: string,
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
    const id = text(categoryId, 'Категория');

    return getDb().$transaction(async (tx) => {
        const category = await tx.category.findUnique({ where: { id } });

        if (!category) throw new InputError('Категория не найдена.', 404);

        return operation(tx);
    });
}

async function findTopic(tx: Prisma.TransactionClient, categoryId: string, topicId: string) {
    const topic = await tx.topic.findFirst({
        where: { id: text(topicId, 'Тема'), categoryId },
    });

    if (!topic) throw new InputError('Тема не найдена в этой категории.', 404);

    return topic;
}

async function findQuestion(tx: Prisma.TransactionClient, categoryId: string, questionId: string) {
    const question = await tx.categoryQuestion.findFirst({
        where: { categoryId, questionId: text(questionId, 'Вопрос') },
        include: { question: true },
    });

    if (!question) throw new InputError('Вопрос не найден в этой категории.', 404);

    return question;
}

async function syncTopicTag(tx: Prisma.TransactionClient, topicId: string, name: string) {
    const link = await tx.topicTag.findFirst({ where: { topicId, isAutoCreated: true } });

    if (link) {
        await tx.tag.update({ where: { id: link.tagId }, data: { name } });
        return;
    }

    const tag = await tx.tag.upsert({
        where: { name },
        update: {},
        create: { id: randomUUID(), name },
    });

    await tx.topicTag.create({ data: { topicId, tagId: tag.id, isAutoCreated: true } });
}

async function nextCategoryPosition(tx: Prisma.TransactionClient, categoryId: string) {
    const result = await tx.categoryQuestion.aggregate({ where: { categoryId }, _max: { position: true } });

    return (result._max.position ?? -1) + 1;
}

async function nextTopicPosition(tx: Prisma.TransactionClient, topicId: string) {
    const result = await tx.topicQuestion.aggregate({ where: { topicId }, _max: { position: true } });

    return (result._max.position ?? -1) + 1;
}

async function serializeQuestion(
    tx: Prisma.TransactionClient,
    categoryId: string,
    questionId: string,
) {
    const link = await tx.categoryQuestion.findFirst({
        where: { categoryId, questionId },
        include: { question: true },
    });

    if (!link) throw new InputError('Вопрос не найден в этой категории.', 404);

    const topic = await tx.topicQuestion.findUnique({ where: { questionId } });

    return {
        ...link.question,
        categoryId,
        topicId: topic?.topicId ?? null,
        position: link.position,
        topicPosition: topic?.position ?? null,
    };
}

export function updateCategory(categoryId: string, input: unknown) {
    const data = categoryInput(input);

    return inCategory(categoryId, (tx) => tx.category.update({ where: { id: categoryId }, data }));
}

export function deleteCategory(categoryId: string) {
    return inCategory(categoryId, async (tx) => {
        const questions = await tx.categoryQuestion.findMany({
            where: { categoryId },
            select: { questionId: true },
        });

        if (questions.length)
            await tx.question.deleteMany({ where: { id: { in: questions.map(({ questionId }) => questionId) } } });

        await tx.category.delete({ where: { id: categoryId } });
    });
}

export function createTopic(categoryId: string, input: unknown) {
    const data = topicInput(input);

    return inCategory(categoryId, async (tx) => {
        const topic = await tx.topic.create({ data: { ...data, id: randomUUID(), categoryId } });

        await syncTopicTag(tx, topic.id, topic.name);

        return topic;
    });
}

export function updateTopic(categoryId: string, topicId: string, input: unknown) {
    const data = topicInput(input);

    return inCategory(categoryId, async (tx) => {
        const topic = await findTopic(tx, categoryId, topicId);
        const result = await tx.topic.update({ where: { id: topic.id }, data });

        await syncTopicTag(tx, topic.id, result.name);

        return result;
    });
}

export function deleteTopic(categoryId: string, topicId: string) {
    return inCategory(categoryId, async (tx) => {
        const topic = await findTopic(tx, categoryId, topicId);
        const link = await tx.topicTag.findFirst({ where: { topicId: topic.id, isAutoCreated: true } });

        await tx.topic.delete({ where: { id: topic.id } });

        if (link) await tx.tag.delete({ where: { id: link.tagId } });
    });
}

export function createQuestion(categoryId: string, input: unknown) {
    const data = questionInput(input);

    return inCategory(categoryId, async (tx) => {
        if (data.topicId) await findTopic(tx, categoryId, data.topicId);

        const question = await tx.question.create({
            data: { id: randomUUID(), question: data.question, answer: data.answer },
        });
        await tx.categoryQuestion.create({
            data: {
                categoryId,
                questionId: question.id,
                position: await nextCategoryPosition(tx, categoryId),
            },
        });

        if (data.topicId)
            await tx.topicQuestion.create({
                data: {
                    topicId: data.topicId,
                    questionId: question.id,
                    position: await nextTopicPosition(tx, data.topicId),
                },
            });

        return serializeQuestion(tx, categoryId, question.id);
    });
}

export function updateQuestion(categoryId: string, questionId: string, input: unknown) {
    const data = questionInput(input);

    return inCategory(categoryId, async (tx) => {
        const current = await findQuestion(tx, categoryId, questionId);

        if (data.topicId) await findTopic(tx, categoryId, data.topicId);

        await tx.question.update({
            where: { id: current.questionId },
            data: { question: data.question, answer: data.answer },
        });

        const topicLink = await tx.topicQuestion.findUnique({ where: { questionId: current.questionId } });

        if (topicLink?.topicId !== data.topicId) {
            if (topicLink) await tx.topicQuestion.delete({ where: { questionId: current.questionId } });

            if (data.topicId)
                await tx.topicQuestion.create({
                    data: {
                        topicId: data.topicId,
                        questionId: current.questionId,
                        position: await nextTopicPosition(tx, data.topicId),
                    },
                });
        }

        return serializeQuestion(tx, categoryId, current.questionId);
    });
}

export function deleteQuestion(categoryId: string, questionId: string) {
    return inCategory(categoryId, async (tx) => {
        const question = await findQuestion(tx, categoryId, questionId);

        await tx.question.delete({ where: { id: question.questionId } });
    });
}

export async function prepareCategoryFocus(categoryId: string, questionId: string) {
    const library = await readCategory(categoryId);
    const questions = library.questions.map(({ id, question, answer }) => ({ id, question, answer }));

    if (!questions.some(({ id }) => id === text(questionId, 'Вопрос')))
        throw new InputError('Вопрос не найден в этой категории.', 404);

    return { questions, questionId };
}

export async function prepareTopicFocus(categoryId: string, topicId: string, questionId: string) {
    const library = await readCategory(categoryId);

    if (!library.topics.some(({ id }) => id === text(topicId, 'Тема')))
        throw new InputError('Тема не найдена в этой категории.', 404);

    const questionIds = library.topicQuestions
        .filter((link) => link.topicId === topicId)
        .map((link) => link.questionId);
    const questions = library.questions
        .filter((question) => questionIds.includes(question.id))
        .map(({ id, question, answer }) => ({ id, question, answer }));

    if (!questions.some(({ id }) => id === text(questionId, 'Вопрос')))
        throw new InputError('Вопрос не найден в этой теме.', 404);

    return { questions, questionId };
}

export const listGroups = listCategories;
export const createGroup = createCategory;
export const updateGroup = updateCategory;
export const deleteGroup = deleteCategory;

export async function readGroup(categoryId: string) {
    const library = await readCategory(categoryId);
    const categoryQuestions = new Map(
        library.categoryQuestions.map(({ questionId, position }) => [questionId, position]),
    );

    return {
        ...library.category,
        topics: library.topics.map((topic) => ({
            ...topic,
            groupId: categoryId,
            isDefault: false,
            questions: library.topicQuestions
                .filter(({ topicId }) => topicId === topic.id)
                .map(({ questionId, position }) => {
                    const question = library.questions.find(({ id }) => id === questionId)!;

                    return { ...question, topicId: topic.id, position, groupId: categoryId };
                }),
        })),
        questions: library.questions.map((question) => ({
            ...question,
            groupId: categoryId,
            position: categoryQuestions.get(question.id) ?? 0,
        })),
    };
}
