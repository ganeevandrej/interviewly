import { config } from 'dotenv';
import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import * as groups from '../src/app/api/groups/route';
import * as group from '../src/app/api/groups/[groupId]/route';
import * as topics from '../src/app/api/groups/[groupId]/topics/route';
import * as topic from '../src/app/api/groups/[groupId]/topics/[topicId]/route';
import * as questions from '../src/app/api/groups/[groupId]/questions/route';
import * as question from '../src/app/api/groups/[groupId]/questions/[questionId]/route';
import { getDb } from '../src/server/db';
import { respond } from '../src/server/http';

config({ path: '.env.local', quiet: true });
config({ quiet: true });
const request = (method: string, body?: unknown) =>
  new Request('http://localhost/api/groups', {
    method,
    ...(body === undefined
      ? {}
      : { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),
  });
async function result<T>(response: Response, status = 200): Promise<T> {
  assert.equal(response.status, status);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json();
  return body.data as T;
}
type Question = { id: string; topicId: string; position: number; question: string; answer: string };
type Topic = {
  id: string;
  groupId: string;
  isDefault: boolean;
  name: string;
  questions: Question[];
};
type Group = { id: string; name: string; accentColor: string; topics: Topic[] };

test('server API with real PostgreSQL', async (t) => {
  const db = getDb();
  const ids: string[] = [];
  try {
    const a = await result<Group>(
      await groups.POST(
        request('POST', { name: 'API test ' + randomUUID(), accentColor: '#123456' }),
      ),
      201,
    );
    ids.push(a.id);
    const b = await result<Group>(
      await groups.POST(
        request('POST', { name: 'API test ' + randomUUID(), accentColor: '#abcdef' }),
      ),
      201,
    );
    ids.push(b.id);
    const ctx = { params: { groupId: a.id } };
    const otherCtx = { params: { groupId: b.id } };
    const snapshot = async () => result<Group>(await group.GET(request('GET'), ctx));
    const makeTopic = async (name: string, context = ctx) =>
      result<Topic>(await topics.POST(request('POST', { name }), context), 201);
    const makeQuestion = async (topicId: string | null, text = 'Question') =>
      result<Question>(
        await questions.POST(request('POST', { topicId, question: text, answer: 'Answer' }), ctx),
        201,
      );
    const topicCtx = (topicId: string) => ({ params: { groupId: a.id, topicId } });
    const questionCtx = (questionId: string) => ({ params: { groupId: a.id, questionId } });

    await t.test(
      'group creation atomically includes one default topic and reads fresh data',
      async () => {
        assert.equal(a.topics.length, 1);
        assert.equal(a.topics[0].isDefault, true);
        assert.equal(a.topics[0].name, 'Без темы');
        assert.notEqual(a.topics[0].id, b.topics[0].id);
        const updated = await result<Group>(
          await group.PUT(request('PUT', { name: ' Renamed ', accentColor: '#fedcba' }), ctx),
        );
        assert.equal(updated.name, 'Renamed');
        assert.equal((await snapshot()).accentColor, '#fedcba');
        const all = await result<Group[]>(await groups.GET());
        assert.ok(all.some((item) => item.id === a.id));
      },
    );
    await t.test(
      'rejects malformed JSON, empty values, invalid colors and unexpected fields',
      async () => {
        assert.equal(
          (
            await groups.POST(
              new Request('http://localhost', {
                method: 'POST',
                body: '{',
                headers: { 'Content-Type': 'application/json' },
              }),
            )
          ).status,
          400,
        );
        assert.equal(
          (await groups.POST(new Request('http://localhost', { method: 'POST', body: '{}' })))
            .status,
          415,
        );
        for (const body of [
          null,
          [],
          { name: ' ', accentColor: '#123456' },
          { name: 'Name', accentColor: 'red' },
          { name: 'Name', accentColor: '#123456', id: 'injected' },
        ]) {
          assert.equal((await groups.POST(request('POST', body))).status, 400);
        }
        assert.equal(
          (await topics.POST(request('POST', { name: 'Fake default', isDefault: true }), ctx))
            .status,
          400,
        );
        const before = await snapshot();
        assert.equal(
          (await questions.POST(request('POST', { question: 'Q', answer: ' ' }), ctx)).status,
          400,
        );
        assert.deepEqual(await snapshot(), before);
      },
    );
    await t.test('system topic cannot be renamed or deleted', async () => {
      assert.equal(
        (await topic.PUT(request('PUT', { name: 'Changed' }), topicCtx(a.topics[0].id))).status,
        409,
      );
      assert.equal((await topic.DELETE(request('DELETE'), topicCtx(a.topics[0].id))).status, 409);
      assert.equal((await snapshot()).topics.filter((item) => item.isDefault).length, 1);
    });
    const own = await makeTopic('Основы');
    const other = await makeTopic('Основы', otherCtx);
    const q = await makeQuestion(own.id);
    await t.test('topics and questions cannot be changed through another group', async () => {
      const before = await snapshot();
      assert.equal(
        (
          await questions.POST(
            request('POST', { topicId: other.id, question: 'Q', answer: 'A' }),
            ctx,
          )
        ).status,
        404,
      );
      assert.equal(
        (
          await question.PUT(
            request('PUT', { topicId: other.id, question: 'Changed', answer: 'A' }),
            questionCtx(q.id),
          )
        ).status,
        404,
      );
      assert.equal((await topic.DELETE(request('DELETE'), topicCtx(other.id))).status, 404);
      assert.equal(
        (await question.DELETE(request('DELETE'), { params: { groupId: b.id, questionId: q.id } }))
          .status,
        404,
      );
      assert.deepEqual(await snapshot(), before);
    });
    await t.test(
      'rename, question edit and move to default preserve content and order',
      async () => {
        await result<Topic>(
          await topic.PUT(request('PUT', { name: 'Асинхронность' }), topicCtx(own.id)),
        );
        const first = await makeQuestion(null);
        const changed = await result<Question>(
          await question.PUT(
            request('PUT', { topicId: null, question: ' Changed ', answer: ' Updated ' }),
            questionCtx(q.id),
          ),
        );
        assert.equal(changed.question, 'Changed');
        assert.equal(changed.answer, 'Updated');
        assert.equal(changed.topicId, a.topics[0].id);
        assert.ok(changed.position > first.position);
        const edited = await result<Question>(
          await question.PUT(
            request('PUT', { topicId: changed.topicId, question: 'Again', answer: 'Answer' }),
            questionCtx(q.id),
          ),
        );
        assert.equal(edited.position, changed.position);
        assert.equal((await question.DELETE(request('DELETE'), questionCtx(first.id))).status, 204);
        assert.equal((await question.DELETE(request('DELETE'), questionCtx(first.id))).status, 404);
      },
    );
    await t.test('concurrent creates receive distinct sequential positions', async () => {
      const created = await Promise.all([
        makeQuestion(own.id, 'A'),
        makeQuestion(own.id, 'B'),
        makeQuestion(own.id, 'C'),
      ]);
      assert.equal(new Set(created.map((item) => item.position)).size, 3);
    });
    await t.test(
      'topic deletion appends its questions to default, preserving IDs, content and order',
      async () => {
        const before = await snapshot();
        const source = before.topics.find((item) => item.id === own.id)!;
        const target = before.topics.find((item) => item.isDefault)!;
        assert.equal((await topic.DELETE(request('DELETE'), topicCtx(own.id))).status, 204);
        const after = await snapshot();
        assert.ok(!after.topics.some((item) => item.id === own.id));
        const moved = after.topics.find((item) => item.isDefault)!.questions;
        assert.deepEqual(
          moved.map((item) => item.id),
          [...target.questions, ...source.questions].map((item) => item.id),
        );
        assert.deepEqual(
          moved.slice(target.questions.length).map((item) => item.question),
          source.questions.map((item) => item.question),
        );
        assert.ok(await db.topic.findUnique({ where: { id: other.id } }));
      },
    );
    await t.test('missing default rejects topic deletion without losing questions', async () => {
      const regular = await makeTopic('Keep', otherCtx);
      const item = await result<Question>(
        await questions.POST(
          request('POST', { topicId: regular.id, question: 'Keep', answer: 'Keep' }),
          otherCtx,
        ),
        201,
      );
      await db.topic.delete({ where: { id: b.topics[0].id } });
      const response = await topic.DELETE(request('DELETE'), {
        params: { groupId: b.id, topicId: regular.id },
      });
      assert.equal(response.status, 409);
      assert.ok(await db.topic.findUnique({ where: { id: regular.id } }));
      assert.equal(
        (await db.question.findUniqueOrThrow({ where: { id: item.id } })).topicId,
        regular.id,
      );
      await db.topic.create({
        data: { id: b.topics[0].id, groupId: b.id, name: 'Без темы', isDefault: true },
      });
    });
    await t.test('group deletion cascades only within the requested group', async () => {
      assert.equal((await group.DELETE(request('DELETE'), ctx)).status, 204);
      assert.equal(await db.topic.count({ where: { groupId: a.id } }), 0);
      assert.equal(await db.question.count({ where: { id: q.id } }), 0);
      assert.ok(await db.questionGroup.findUnique({ where: { id: b.id } }));
      assert.equal((await group.GET(request('GET'), ctx)).status, 404);
    });
    await t.test('unexpected server errors do not expose internals', async () => {
      const response = await respond(async () => {
        throw new Error('sensitive-internal-detail');
      });
      assert.equal(response.status, 500);
      assert.ok(!(await response.text()).includes('sensitive-internal-detail'));
    });
  } finally {
    // Only IDs created by this test run; never delete the user's groups.
    await db.questionGroup.deleteMany({ where: { id: { in: ids } } });
    await db.$disconnect();
  }
});
