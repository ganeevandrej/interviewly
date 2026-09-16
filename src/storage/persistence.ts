import { InterviewlyData } from '@/types';

const STORAGE_KEY = 'interviewly:data:v1';

export const seedData: InterviewlyData = {
  groups: [
    { id: 'javascript', name: 'JavaScript', accentColor: '#facc15' },
    { id: 'react', name: 'React', accentColor: '#22d3ee' },
    { id: 'typescript', name: 'TypeScript', accentColor: '#3b82f6' },
    { id: 'css', name: 'CSS', accentColor: '#8b5cf6' },
    { id: 'experience', name: 'Опыт', accentColor: '#f472b6' },
    { id: 'soft-skills', name: 'Soft Skills', accentColor: '#34d399' }
  ],
  questions: [
    {
      id: 'react-virtual-dom',
      groupId: 'react',
      question: 'Что такое Virtual DOM?',
      answer:
        'Virtual DOM — это легковесное представление UI в памяти. React сравнивает новое дерево со старым, находит минимальные изменения и затем обновляет реальный DOM.'
    },
    {
      id: 'react-effect-layout',
      groupId: 'react',
      question: 'В чем разница между useEffect и useLayoutEffect?',
      answer:
        'useEffect выполняется после отрисовки браузером, поэтому подходит для запросов и синхронизации. useLayoutEffect выполняется синхронно после изменений DOM, но до покраски, и полезен для измерений layout.'
    },
    {
      id: 'react-usememo',
      groupId: 'react',
      question: 'Для чего нужен useMemo?',
      answer:
        'useMemo мемоизирует результат вычисления между рендерами, пока зависимости не изменились. Его используют для дорогих вычислений и стабильных значений, когда это реально снижает лишнюю работу.'
    },
    {
      id: 'js-closure',
      groupId: 'javascript',
      question: 'Что такое замыкание?',
      answer:
        'Замыкание — это способность функции помнить переменные из внешней области видимости даже после завершения этой внешней функции.'
    },
    {
      id: 'ts-interface-type',
      groupId: 'typescript',
      question: 'Чем interface отличается от type?',
      answer:
        'Оба описывают форму данных. Interface удобен для расширения и declaration merging, type лучше подходит для union/intersection, mapped types и алиасов примитивов.'
    }
  ]
};

const isInterviewlyData = (value: unknown): value is InterviewlyData => {
  if (!value || typeof value !== 'object') return false;
  const data = value as InterviewlyData;
  return Array.isArray(data.groups) && Array.isArray(data.questions);
};

export const loadInterviewlyData = (): InterviewlyData => {
  if (typeof window === 'undefined') return seedData;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveInterviewlyData(seedData);
    return seedData;
  }

  try {
    const parsed = JSON.parse(raw);
    return isInterviewlyData(parsed) ? parsed : seedData;
  } catch {
    return seedData;
  }
};

export const saveInterviewlyData = (data: InterviewlyData) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
