const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(require.resolve('../src/storage/persistence.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

function loadModule(window) {
  const context = { exports: {}, ...(window ? { window } : {}) };
  vm.runInNewContext(outputText, context);
  return context.exports;
}

const validData = {
  groups: [{ id: 'group', name: 'Example', accentColor: '#ffffff' }],
  questions: [{ id: 'question', groupId: 'group', question: 'Why?', answer: 'Because.' }],
};

test('valid and empty libraries are accepted', () => {
  const { isInterviewlyData } = loadModule();
  assert.equal(isInterviewlyData(validData), true);
  assert.equal(isInterviewlyData({ groups: [], questions: [] }), true);
});

test('malformed records, duplicate IDs and orphan questions are rejected', () => {
  const { isInterviewlyData } = loadModule();
  for (const data of [
    null,
    {},
    { groups: [null], questions: [] },
    { ...validData, groups: [{ ...validData.groups[0], name: 42 }] },
    { ...validData, questions: [{ ...validData.questions[0], answer: null }] },
    { ...validData, groups: [validData.groups[0], validData.groups[0]] },
    { ...validData, questions: [validData.questions[0], validData.questions[0]] },
    { ...validData, groups: [] },
  ])
    assert.equal(isInterviewlyData(data), false);
});

test('saved v1 data loads without being rewritten', () => {
  let writes = 0;
  const api = loadModule({
    localStorage: {
      getItem(key) {
        assert.equal(key, 'interviewly:data:v1');
        return JSON.stringify(validData);
      },
      setItem() {
        writes++;
      },
    },
  });
  assert.equal(JSON.stringify(api.loadInterviewlyData()), JSON.stringify(validData));
  assert.equal(writes, 0);
});

test('missing, corrupt and invalid data fall back without overwriting storage', () => {
  for (const raw of [null, '{', '{}', '{"groups":[null],"questions":[]}']) {
    const api = loadModule({
      localStorage: {
        getItem() {
          return raw;
        },
        setItem() {
          assert.fail('loading must not write');
        },
      },
    });
    assert.equal(api.loadInterviewlyData(), api.seedData);
  }
});

test('unavailable storage and quota errors do not crash the app', () => {
  const api = loadModule({
    get localStorage() {
      throw new Error('Access denied');
    },
  });
  assert.equal(api.loadInterviewlyData(), api.seedData);
  assert.equal(api.saveInterviewlyData(validData), false);
  const full = loadModule({
    localStorage: {
      setItem() {
        throw new Error('Quota exceeded');
      },
    },
  });
  assert.equal(full.saveInterviewlyData(validData), false);
});

test('saving preserves the storage key and library', () => {
  const api = loadModule({
    localStorage: {
      setItem(key, value) {
        assert.equal(key, 'interviewly:data:v1');
        assert.deepEqual(JSON.parse(value), validData);
      },
    },
  });
  assert.equal(api.saveInterviewlyData(validData), true);
});

test('server rendering does not access browser storage', () => {
  const api = loadModule();
  assert.equal(api.loadInterviewlyData(), api.seedData);
  assert.equal(api.saveInterviewlyData(validData), false);
});
