const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(require.resolve('../src/store/useInterviewlyStore.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

// Exercise the hook's functional state updates without mounting browser effects.
function createStore() {
  const initial = {
    groups: ['a', 'b'].map((id) => ({ id, name: id, accentColor: '#fff' })),
    categories: [
      { id: 'shared', name: 'Shared' },
      { id: 'other', name: 'Other' },
    ],
    groupCategories: ['a', 'b'].map((groupId) => ({ groupId, categoryId: 'shared' })),
    questions: ['a', 'b'].map((groupId) => ({
      id: groupId,
      groupId,
      categoryId: 'shared',
      question: 'Q',
      answer: 'A',
    })),
  };
  const states = [];
  let cursor = 0;
  const react = {
    createContext: () => ({}),
    useEffect: () => {},
    useRef: (value) => ({ current: value }),
    useMemo: (fn) => fn(),
    useState(value) {
      const index = cursor++;
      if (!(index in states)) states[index] = value;
      return [
        states[index],
        (update) => {
          states[index] = typeof update === 'function' ? update(states[index]) : update;
        },
      ];
    },
  };
  const context = {
    exports: {},
    require: (name) => {
      if (name === 'react') return react;
      if (name === '@/storage/persistence') return { seedData: initial };
      throw new Error('Unexpected module: ' + name);
    },
  };
  vm.runInNewContext(outputText, context);
  return () => {
    cursor = 0;
    return context.exports.useInterviewlyStoreState();
  };
}

test('detaching shared category affects only the target group and preserves questions', () => {
  const store = createStore();
  store().removeCategoryFromGroup('a', 'shared');
  assert.equal(store().questions.find((q) => q.id === 'a').categoryId, null);
  assert.equal(store().questions.find((q) => q.id === 'b').categoryId, 'shared');
  assert.equal(store().questions.length, 2);
  assert.equal(store().categories.length, 2);
  assert.equal(store().groupCategories.length, 1);
});

test('deleting category clears all placements without deleting questions', () => {
  const store = createStore();
  store().deleteCategory('shared');
  assert.equal(store().questions.length, 2);
  assert.ok(store().questions.every((q) => q.categoryId === null));
  assert.equal(store().groupCategories.length, 0);
  assert.equal(store().categories.length, 1);
});

test('deleting group preserves common categories and other groups questions', () => {
  const store = createStore();
  store().deleteGroup('a');
  assert.equal(store().categories.length, 2);
  assert.equal(store().questions.length, 1);
  assert.equal(store().questions[0].groupId, 'b');
  assert.equal(store().groupCategories.length, 1);
});

test('links are unique and cannot reference missing entities', () => {
  const store = createStore();
  store().addCategoryToGroup('a', 'shared');
  store().addCategoryToGroup('missing', 'shared');
  store().addCategoryToGroup('a', 'missing');
  assert.equal(store().groupCategories.length, 2);
  store().addCategoryToGroup('a', 'other');
  assert.equal(store().groupCategories.length, 3);
});

test('question placement is restricted to linked categories in its own group', () => {
  const store = createStore();
  const payload = { question: 'Updated', answer: 'Answer', categoryId: 'other' };
  store().updateQuestion('a', payload);
  assert.equal(store().questions[0].categoryId, 'shared');
  store().addCategoryToGroup('a', 'other');
  store().updateQuestion('a', payload);
  assert.equal(store().questions[0].categoryId, 'other');
  assert.equal(store().questions[1].categoryId, 'shared');
  store().updateQuestion('a', { ...payload, categoryId: null });
  assert.equal(store().questions[0].categoryId, null);
  store().createQuestion({ ...payload, groupId: 'b' });
  store().createQuestion({ ...payload, groupId: 'missing', categoryId: null });
  assert.equal(store().questions.length, 2);
  store().createQuestion({ ...payload, groupId: 'a' });
  assert.equal(store().questions.length, 3);
});

test('categories can exist independently, be renamed, and be created within a group', () => {
  const store = createStore();
  store().createCategory('  Independent  ');
  const category = store().categories.at(-1);
  assert.equal(category.name, 'Independent');
  assert.equal(store().groupCategories.length, 2);
  store().renameCategory(category.id, 'Renamed');
  assert.equal(store().categories.at(-1).name, 'Renamed');
  store().createCategory('Attached', 'a');
  assert.equal(store().groupCategories.at(-1).categoryId, store().categories.at(-1).id);
  store().createCategory('  ');
  assert.equal(store().categories.length, 4);
});
