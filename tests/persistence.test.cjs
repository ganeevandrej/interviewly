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

const legacyData = {
  groups: [{ id: 'group', name: 'Example', accentColor: '#ffffff' }],
  questions: [{ id: 'question', groupId: 'group', question: 'Why?', answer: 'Because.' }],
};

const validData = {
  ...legacyData,
  categories: [],
  groupCategories: [],
  questions: legacyData.questions.map((q) => ({ ...q, categoryId: null })),
};

test('valid and empty libraries are accepted', () => {
  const { isInterviewlyData } = loadModule();
  assert.equal(isInterviewlyData(validData), true);
  assert.equal(
    isInterviewlyData({ groups: [], questions: [], categories: [], groupCategories: [] }),
    true,
  );
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
        if (key === 'interviewly:data:v2') return null;
        assert.equal(key, 'interviewly:data:v1');
        return JSON.stringify(legacyData);
      },
      setItem() {
        writes++;
      },
    },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(api.loadInterviewlyData())), validData);
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
        assert.equal(key, 'interviewly:data:v2');
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

const categorizedData = {
  ...validData,
  categories: [{ id: 'category', name: 'Shared' }],
  groupCategories: [{ groupId: 'group', categoryId: 'category' }],
  questions: [{ ...validData.questions[0], categoryId: 'category' }],
};

test('category links and question placement are validated', () => {
  const { isInterviewlyData } = loadModule();
  assert.equal(isInterviewlyData(categorizedData), true);
  assert.equal(isInterviewlyData({ ...validData, categories: categorizedData.categories }), true);
  for (const data of [
    { ...categorizedData, categories: [] },
    {
      ...categorizedData,
      categories: [...categorizedData.categories, ...categorizedData.categories],
    },
    { ...categorizedData, groupCategories: [] },
    {
      ...categorizedData,
      groupCategories: [...categorizedData.groupCategories, ...categorizedData.groupCategories],
    },
    { ...categorizedData, groupCategories: [{ groupId: 'missing', categoryId: 'category' }] },
    { ...categorizedData, questions: [{ ...categorizedData.questions[0], categoryId: 42 }] },
    { ...categorizedData, categories: [{ id: 'category', name: '   ' }] },
    legacyData,
  ])
    assert.equal(isInterviewlyData(data), false);
});

test('v2 round trip preserves categories and takes precedence over v1', () => {
  const values = new Map([['interviewly:data:v1', JSON.stringify(legacyData)]]);
  const api = loadModule({
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  });
  assert.equal(api.saveInterviewlyData(categorizedData), true);
  assert.deepEqual(JSON.parse(JSON.stringify(api.loadInterviewlyData())), categorizedData);
  assert.equal(values.get('interviewly:data:v1'), JSON.stringify(legacyData));
});

test('migration does not reinterpret broken current schemas as legacy data', () => {
  const { migrateInterviewlyData } = loadModule();
  assert.equal(migrateInterviewlyData({ ...legacyData, categories: [] }), null);
  assert.equal(migrateInterviewlyData({ ...categorizedData, groupCategories: [] }), null);
  assert.deepEqual(
    JSON.parse(JSON.stringify(migrateInterviewlyData({ groups: [], questions: [] }))),
    { groups: [], questions: [], categories: [], groupCategories: [] },
  );
});
