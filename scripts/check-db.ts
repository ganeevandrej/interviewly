import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { config } from 'dotenv';

import { getDb } from '../src/server/db';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

async function main() {
    const db = getDb();
    const rollback = new Error('Rollback successful database check');
    try {
        await db.$transaction(async (tx) => {
            const categoryId = randomUUID();
            const topicId = randomUUID();
            const questionId = randomUUID();

            await tx.category.create({
                data: {
                    id: categoryId,
                    name: 'Database check',
                    accentColor: '#000000',
                    topics: { create: { id: topicId, name: 'Основы' } },
                },
            });
            await tx.question.create({
                data: {
                    id: questionId,
                    question: 'Write/read check',
                    answer: 'OK',
                    categories: { create: { categoryId, position: 0 } },
                    topics: { create: { topicId, position: 0 } },
                },
            });

            const saved = await tx.question.findUniqueOrThrow({
                where: { id: questionId },
                include: { categories: true, topics: true },
            });
            assert.equal(saved.categories[0].categoryId, categoryId);
            assert.equal(saved.topics[0].topicId, topicId);

            await tx.topic.delete({ where: { id: topicId } });
            assert.equal((await tx.question.findUniqueOrThrow({ where: { id: questionId } })).id, questionId);

            await tx.question.delete({ where: { id: questionId } });
            await tx.category.delete({ where: { id: categoryId } });
            throw rollback;
        });
    } catch (error) {
        if (error !== rollback) throw error;
    } finally {
        await db.$disconnect();
    }
    console.log('Database check passed: category, topic and independent question links. Transaction rolled back.');
}

main().catch((error: unknown) => {
    const code =
        typeof error === 'object' && error !== null && 'code' in error
            ? String(error.code)
            : 'unknown';
    console.error('Database check failed (code: ' + code + '). Check credentials and migrations.');
    process.exitCode = 1;
});
