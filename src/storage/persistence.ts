import { Category, GroupCategory, InterviewlyData, Question, QuestionGroup } from '@/types';

const STORAGE_KEY = 'interviewly:data:v2';
const LEGACY_STORAGE_KEY = 'interviewly:data:v1';

export const seedData: InterviewlyData = {
  categories: [],
  groupCategories: [],
  groups: [
    { id: 'javascript', name: 'JavaScript', accentColor: '#facc15' },
    { id: 'react', name: 'React', accentColor: '#22d3ee' },
    { id: 'typescript', name: 'TypeScript', accentColor: '#3b82f6' },
    { id: 'css', name: 'CSS', accentColor: '#8b5cf6' },
    { id: 'experience', name: 'Опыт', accentColor: '#f472b6' },
    { id: 'soft-skills', name: 'Soft Skills', accentColor: '#34d399' },
  ],
  questions: [
    {
      id: 'react-virtual-dom',
      groupId: 'react',
      categoryId: null,
      question: 'Что такое Virtual DOM?',
      answer:
        'Virtual DOM — это легковесное представление UI в памяти. React сравнивает новое дерево со старым, находит минимальные изменения и затем обновляет реальный DOM.',
    },
    {
      id: 'react-effect-layout',
      groupId: 'react',
      categoryId: null,
      question: 'В чем разница между useEffect и useLayoutEffect?',
      answer:
        'useEffect выполняется после отрисовки браузером, поэтому подходит для запросов и синхронизации. useLayoutEffect выполняется синхронно после изменений DOM, но до покраски, и полезен для измерений layout.',
    },
    {
      id: 'react-usememo',
      groupId: 'react',
      categoryId: null,
      question: 'Для чего нужен useMemo?',
      answer:
        'useMemo мемоизирует результат вычисления между рендерами, пока зависимости не изменились. Его используют для дорогих вычислений и стабильных значений, когда это реально снижает лишнюю работу.',
    },
    {
      id: 'js-closure',
      groupId: 'javascript',
      categoryId: null,
      question: 'Что такое замыкание?',
      answer:
        'Замыкание — это способность функции помнить переменные из внешней области видимости даже после завершения этой внешней функции.',
    },
    {
      id: 'ts-interface-type',
      groupId: 'typescript',
      categoryId: null,
      question: 'Чем interface отличается от type?',
      answer:
        'Оба описывают форму данных. Interface удобен для расширения и declaration merging, type лучше подходит для union/intersection, mapped types и алиасов примитивов.',
    },
  ],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGroup = (value: unknown): value is QuestionGroup =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  value.id.length > 0 &&
  typeof value.name === 'string' &&
  typeof value.accentColor === 'string';

const isLegacyQuestion = (value: unknown): value is Omit<Question, 'categoryId'> =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  value.id.length > 0 &&
  typeof value.groupId === 'string' &&
  typeof value.question === 'string' &&
  typeof value.answer === 'string';

const isCategory = (value: unknown): value is Category =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  value.id.length > 0 &&
  typeof value.name === 'string' &&
  value.name.trim().length > 0;

const isGroupCategory = (value: unknown): value is GroupCategory =>
  isRecord(value) && typeof value.groupId === 'string' && typeof value.categoryId === 'string';

export const isInterviewlyData = (value: unknown): value is InterviewlyData => {
  if (
    !isRecord(value) ||
    !Array.isArray(value.groups) ||
    !Array.isArray(value.questions) ||
    !Array.isArray(value.categories) ||
    !Array.isArray(value.groupCategories)
  )
    return false;
  if (
    !value.groups.every(isGroup) ||
    !value.categories.every(isCategory) ||
    !value.groupCategories.every(isGroupCategory) ||
    !value.questions.every(
      (q): q is Question =>
        isLegacyQuestion(q) &&
        'categoryId' in q &&
        (q.categoryId === null || typeof q.categoryId === 'string'),
    )
  )
    return false;
  const groupIds = new Set(value.groups.map((g) => g.id));
  const categoryIds = new Set(value.categories.map((c) => c.id));
  const questionIds = new Set(value.questions.map((q) => q.id));
  const links = new Set(
    value.groupCategories.map((link) => JSON.stringify([link.groupId, link.categoryId])),
  );
  return (
    groupIds.size === value.groups.length &&
    categoryIds.size === value.categories.length &&
    questionIds.size === value.questions.length &&
    links.size === value.groupCategories.length &&
    value.groupCategories.every(
      (link) => groupIds.has(link.groupId) && categoryIds.has(link.categoryId),
    ) &&
    value.questions.every(
      (q) =>
        groupIds.has(q.groupId) &&
        (q.categoryId === null || links.has(JSON.stringify([q.groupId, q.categoryId]))),
    )
  );
};

export const migrateInterviewlyData = (value: unknown): InterviewlyData | null => {
  if (isInterviewlyData(value)) return value;
  if (
    !isRecord(value) ||
    'categories' in value ||
    'groupCategories' in value ||
    !Array.isArray(value.groups) ||
    !Array.isArray(value.questions) ||
    !value.groups.every(isGroup) ||
    !value.questions.every(isLegacyQuestion) ||
    value.questions.some((q) => 'categoryId' in q)
  )
    return null;
  const migrated = {
    ...value,
    categories: [],
    groupCategories: [],
    questions: value.questions.map((q) => ({ ...q, categoryId: null })),
  };
  return isInterviewlyData(migrated) ? migrated : null;
};

export const loadInterviewlyData = (): InterviewlyData => {
  if (typeof window === 'undefined') return seedData;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return seedData;
    const parsed: unknown = JSON.parse(raw);
    return migrateInterviewlyData(parsed) ?? seedData;
  } catch {
    return seedData;
  }
};

export const saveInterviewlyData = (data: InterviewlyData): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};
