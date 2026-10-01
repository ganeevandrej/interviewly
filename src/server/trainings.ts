import 'server-only';
import { randomInt, randomUUID } from 'node:crypto';

import { Prisma } from '../generated/prisma/client';

import { getDb } from './db';
import { InputError, text, trainingInput } from './validation';

const trainingInclude = {
    categories: { include: { category: true }, orderBy: { category: { name: 'asc' } } },
    topics: { include: { topic: true }, orderBy: { topic: { name: 'asc' } } },
    questions: {
        include: { question: true },
        orderBy: [{ position: 'asc' }, { questionId: 'asc' }],
    },
} satisfies Prisma.TrainingInclude;

type TrainingPayload = Prisma.TrainingGetPayload<{ include: typeof trainingInclude }>;
type TrainingInput = ReturnType<typeof trainingInput>;

function serializeTraining(training: TrainingPayload) {
    const { categories, topics, questions, ...data } = training;

    return {
        ...data,
        categories: categories.map(({ category }) => category),
        topics: topics.map(({ topic }) => topic),
        questions: questions.map(({ question, position, status }) => ({ ...question, position, status })),
    };
}

function shuffle<T>(items: T[]) {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
        const nextIndex = randomInt(index + 1);
        [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
    }

    return result;
}

async function selectedQuestionIds(tx: Prisma.TransactionClient, input: TrainingInput) {
    const [categories, topics, explicitQuestions] = await Promise.all([
        input.categoryIds.length
            ? tx.category.findMany({
                  where: { id: { in: input.categoryIds } },
                  select: { id: true, questions: { select: { questionId: true } } },
              })
            : [],
        input.topicIds.length
            ? tx.topic.findMany({
                  where: { id: { in: input.topicIds } },
                  select: { id: true, questions: { select: { questionId: true } } },
              })
            : [],
        input.questionIds.length
            ? tx.categoryQuestion.findMany({
                  where: { questionId: { in: input.questionIds } },
                  select: { questionId: true },
              })
            : [],
    ]);

    if (categories.length !== input.categoryIds.length)
        throw new InputError('Одна или несколько категорий не найдены.', 404);
    if (topics.length !== input.topicIds.length)
        throw new InputError('Одна или несколько тем не найдены.', 404);
    if (explicitQuestions.length !== input.questionIds.length)
        throw new InputError('Один или несколько вопросов не найдены.', 404);

    const questionIds = new Set([
        ...categories.flatMap((category) => category.questions.map(({ questionId }) => questionId)),
        ...topics.flatMap((topic) => topic.questions.map(({ questionId }) => questionId)),
        ...explicitQuestions.map(({ questionId }) => questionId),
    ]);

    if (!questionIds.size) throw new InputError('Выберите хотя бы один вопрос.');

    return [...questionIds];
}

async function saveTrainingQuestions(
    tx: Prisma.TransactionClient,
    trainingId: string,
    questionIds: string[],
    order: TrainingInput['order'],
) {
    const orderedQuestionIds = order === 'RANDOM' ? shuffle(questionIds) : questionIds;

    await tx.trainingQuestion.createMany({
        data: orderedQuestionIds.map((questionId, position) => ({
            trainingId,
            questionId,
            position,
        })),
    });
}

export async function listTrainings() {
    const trainings = await getDb().training.findMany({
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        include: trainingInclude,
    });

    return trainings.map(serializeTraining);
}

export async function readTraining(trainingId: string) {
    const training = await getDb().training.findUnique({
        where: { id: text(trainingId, 'Тренировка') },
        include: trainingInclude,
    });

    if (!training) throw new InputError('Тренировка не найдена.', 404);

    return serializeTraining(training);
}

export async function createTraining(input: unknown) {
    const data = trainingInput(input);
    const training = await getDb().$transaction(async (tx) => {
        const questionIds = await selectedQuestionIds(tx, data);
        const training = await tx.training.create({
            data: {
                id: randomUUID(),
                name: data.name,
                order: data.order as 'SEQUENTIAL' | 'RANDOM',
                questionLimit: data.questionLimit,
                categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
                topics: { create: data.topicIds.map((topicId) => ({ topicId })) },
            },
        });

        await saveTrainingQuestions(tx, training.id, questionIds, data.order);

        return tx.training.findUniqueOrThrow({ where: { id: training.id }, include: trainingInclude });
    });

    return serializeTraining(training);
}

export async function updateTraining(trainingId: string, input: unknown) {
    const id = text(trainingId, 'Тренировка');
    const data = trainingInput(input);
    const training = await getDb().$transaction(async (tx) => {
        const existing = await tx.training.findUnique({ where: { id } });

        if (!existing) throw new InputError('Тренировка не найдена.', 404);

        const questionIds = await selectedQuestionIds(tx, data);
        await tx.trainingCategory.deleteMany({ where: { trainingId: id } });
        await tx.trainingTopic.deleteMany({ where: { trainingId: id } });
        await tx.trainingQuestion.deleteMany({ where: { trainingId: id } });
        await tx.training.update({
            where: { id },
            data: {
                name: data.name,
                order: data.order as 'SEQUENTIAL' | 'RANDOM',
                questionLimit: data.questionLimit,
                status: 'IN_PROGRESS',
                categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
                topics: { create: data.topicIds.map((topicId) => ({ topicId })) },
            },
        });
        await saveTrainingQuestions(tx, id, questionIds, data.order);

        return tx.training.findUniqueOrThrow({ where: { id }, include: trainingInclude });
    });

    return serializeTraining(training);
}

export async function deleteTraining(trainingId: string) {
    await getDb().training.delete({ where: { id: text(trainingId, 'Тренировка') } });
}

export async function startTraining(trainingId: string) {
    const training = await readTraining(trainingId);

    if (training.status === 'COMPLETED')
        throw new InputError('Завершённую тренировку сначала нужно повторить.', 409);

    return training;
}

export async function restartTraining(trainingId: string) {
    const id = text(trainingId, 'Тренировка');
    await getDb().$transaction(async (tx) => {
        const result = await tx.training.updateMany({
            where: { id },
            data: { status: 'IN_PROGRESS' },
        });

        if (!result.count) throw new InputError('Тренировка не найдена.', 404);

        await tx.trainingQuestion.updateMany({
            where: { trainingId: id },
            data: { status: 'IN_PROGRESS' },
        });
    });

    return readTraining(id);
}

export async function regenerateTraining(trainingId: string) {
    const id = text(trainingId, 'Тренировка');
    await getDb().$transaction(async (tx) => {
        const questions = await tx.trainingQuestion.findMany({
            where: { trainingId: id },
            orderBy: [{ position: 'asc' }, { questionId: 'asc' }],
        });

        if (!questions.length) {
            const exists = await tx.training.findUnique({ where: { id } });
            if (!exists) throw new InputError('Тренировка не найдена.', 404);
            throw new InputError('В тренировке нет вопросов.', 409);
        }

        const shuffled = shuffle(questions);
        await Promise.all(
            shuffled.map(({ questionId }, position) =>
                tx.trainingQuestion.update({
                    where: { trainingId_questionId: { trainingId: id, questionId } },
                    data: { position },
                }),
            ),
        );
        await tx.training.update({ where: { id }, data: { order: 'RANDOM' } });
    });

    return readTraining(id);
}

export async function updateTrainingQuestion(
    trainingId: string,
    questionId: string,
    input: unknown,
) {
    if (!input || typeof input !== 'object' || Array.isArray(input) || !('status' in input))
        throw new InputError('Поле «Статус» обязательно.');

    if (input.status !== 'ACCEPTED') throw new InputError('Статус вопроса должен быть ACCEPTED.');

    const training = text(trainingId, 'Тренировка');
    const question = text(questionId, 'Вопрос');
    await getDb().$transaction(async (tx) => {
        const result = await tx.trainingQuestion.updateMany({
            where: { trainingId: training, questionId: question },
            data: { status: 'ACCEPTED' },
        });

        if (!result.count) throw new InputError('Вопрос не найден в этой тренировке.', 404);

        const remaining = await tx.trainingQuestion.count({
            where: { trainingId: training, status: 'IN_PROGRESS' },
        });

        if (!remaining) await tx.training.update({ where: { id: training }, data: { status: 'COMPLETED' } });
    });

    return readTraining(training);
}

export async function prepareTrainingFocus(trainingId: string, questionId: string) {
    const training = await readTraining(trainingId);
    const question = text(questionId, 'Вопрос');

    if (!training.questions.some(({ id }) => id === question))
        throw new InputError('Вопрос не найден в этой тренировке.', 404);

    return { questions: training.questions, questionId: question, questionLimit: training.questionLimit };
}
