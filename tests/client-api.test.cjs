const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');
const source = fs.readFileSync(require.resolve('../src/client/library.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
function api(fetch) {
  const context = { exports: {}, fetch };
  vm.runInNewContext(outputText, context);
  return context.exports;
}
test('server library derives question group from its topic without sharing topics', () => {
  const { flattenLibrary } = api();
  const groups = ['a', 'b'].map((id) => ({
    id, name: id, accentColor: '#123456',
    topics: [{ id: 'topic-' + id, groupId: id, name: 'Same name', isDefault: false,
      questions: [{ id: 'question-' + id, topicId: 'topic-' + id, question: 'Q', answer: 'A', position: 0 }] }],
  }));
  const data = flattenLibrary(groups);
  assert.equal(data.groups.length, 2);
  assert.equal(data.topics.length, 2);
  assert.equal(data.questions[1].groupId, 'b');
  assert.equal(data.questions[1].topicId, 'topic-b');
  assert.equal('topics' in data.groups[0], false);
  assert.equal('questions' in data.topics[0], false);
  assert.equal(flattenLibrary([]).groups.length, 0);
});
test('mutations send JSON and never cache API responses', async () => {
  const { apiRequest } = api(async (path, options) => {
    assert.equal(path, '/api/groups');
    assert.equal(options.method, 'POST');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers['Content-Type'], 'application/json');
    assert.equal(JSON.parse(options.body).name, 'New');
    return { ok: true, status: 201, json: async () => ({ data: { id: 'created' } }) };
  });
  assert.equal((await apiRequest('/api/groups', 'POST', { name: 'New' })).id, 'created');
});
test('successful deletes do not attempt to parse an empty body', async () => {
  const { apiRequest } = api(async () => ({ ok: true, status: 204, json: () => { throw new Error('Unexpected JSON'); } }));
  assert.equal(await apiRequest('/api/groups/a', 'DELETE'), undefined);
});
test('server validation errors reach the form and writes are never automatically retried', async () => {
  let calls = 0;
  const { apiRequest } = api(async () => { calls++; return {
    ok: false, status: 409, json: async () => ({ error: 'Protected topic' }),
  }; });
  await assert.rejects(apiRequest('/api/groups/a', 'PUT', {}), { message: 'Protected topic' });
  assert.equal(calls, 1);
});
test('network and non-JSON errors reject without returning demo data', async () => {
  await assert.rejects(api(async () => { throw new Error('network'); }).apiRequest('/api/groups'));
  await assert.rejects(api(async () => ({
    ok: false, status: 502, json: async () => { throw new Error('invalid json'); },
  })).apiRequest('/api/groups'));
});
test('aborted requests preserve cancellation', async () => {
  const failure = new Error('aborted');
  const { apiRequest } = api(async () => { throw failure; });
  await assert.rejects(apiRequest('/api/groups', 'GET', undefined, { aborted: true }), (error) => error === failure);
});
