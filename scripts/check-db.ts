import { config } from 'dotenv';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { getDb } from '../src/server/db';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

async function main() {
  const db = getDb();
  const rollback = new Error('Rollback successful database check');
  try {
    await db.$transaction(
      async (tx) => {
        const groupId = randomUUID();
        const otherGroupId = randomUUID();
        const defaultId = randomUUID();
        const topicId = randomUUID();
        const otherTopicId = randomUUID();
        const questionId = randomUUID();

        await tx.questionGroup.create({
          data: {
            id: groupId,
            name: 'Database check',
            accentColor: '#000000',
            topics: {
              create: [
                { id: defaultId, name: 'Без темы', isDefault: true },
                { id: topicId, name: 'Основы' },
              ],
            },
          },
        });
        await tx.questionGroup.create({
          data: {
            id: otherGroupId,
            name: 'Other group',
            accentColor: '#000000',
            topics: { create: { id: otherTopicId, name: 'Основы' } },
          },
        });
        await tx.question.create({
          data: {
            id: questionId,
            topicId,
            question: 'Write/read check',
            answer: 'OK',
            position: 0,
          },
        });
        const saved = await tx.question.findUniqueOrThrow({
          where: { id: questionId },
          include: { topic: true },
        });
        assert.equal(saved.answer, 'OK');
        assert.equal(saved.topic.groupId, groupId);
        // Stage 2 will expose this transaction as the topic deletion operation.
        await tx.question.updateMany({ where: { topicId }, data: { topicId: defaultId } });
        await tx.topic.delete({ where: { id: topicId } });
        assert.equal(
          (await tx.question.findUniqueOrThrow({ where: { id: questionId } })).topicId,
          defaultId,
        );
        assert.equal(
          (await tx.topic.findUniqueOrThrow({ where: { id: otherTopicId } })).name,
          'Основы',
        );
        await tx.questionGroup.delete({ where: { id: groupId } });
        assert.equal(await tx.question.count({ where: { id: questionId } }), 0);
        assert.equal(await tx.topic.count({ where: { groupId } }), 0);
        assert.equal(await tx.topic.count({ where: { groupId: otherGroupId } }), 1);
        throw rollback;
      },
      { timeout: 20000 },
    );
  } catch (error) {
    if (error !== rollback) throw error;
  } finally {
    await db.$disconnect();
  }
  console.log(
    'Database check passed: group-owned topics, write/read, move to default topic, group cascade. Transaction rolled back.',
  );
}
main().catch((error: unknown) => {
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'unknown';
  console.error(
    'Database check failed (code: ' + code + '). Check credentials, connection and migrations.',
  );
  process.exitCode = 1;
});
