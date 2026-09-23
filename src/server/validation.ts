import 'server-only';

export class InputError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}
export function record(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new InputError('Ожидается JSON-объект.');
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) throw new InputError('Неизвестное поле: ' + key);
  }
  return value as Record<string, unknown>;
}
export function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim() || value.includes('\0'))
    throw new InputError('Заполните поле «' + field + '».');
  return value.trim();
}
export function groupInput(value: unknown) {
  const data = record(value, ['name', 'accentColor']);
  const name = text(data.name, 'Название');
  const accentColor = text(data.accentColor, 'Цвет');
  if (!/^#[0-9a-f]{6}$/i.test(accentColor))
    throw new InputError('Цвет должен иметь формат #RRGGBB.');
  return { name, accentColor };
}
export function topicInput(value: unknown) {
  const data = record(value, ['name']);
  return { name: text(data.name, 'Название') };
}
export function questionInput(value: unknown) {
  const data = record(value, ['topicId', 'question', 'answer']);
  return {
    topicId:
      data.topicId === null || data.topicId === undefined ? null : text(data.topicId, 'Тема'),
    question: text(data.question, 'Вопрос'),
    answer: text(data.answer, 'Ответ'),
  };
}

const storyFields = [
  'title',
  'context',
  'problem',
  'responsibility',
  'solution',
  'difficulties',
  'learned',
  'additionalQuestions',
] as const;

function optionalText(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  return text(value, field);
}

export function storyInput(value: unknown) {
  const data = record(value, storyFields);
  return {
    title: text(data.title, 'Заголовок'),
    context: optionalText(data.context, 'Контекст'),
    problem: optionalText(data.problem, 'Проблема'),
    responsibility: optionalText(data.responsibility, 'Ответственность'),
    solution: optionalText(data.solution, 'Решение'),
    difficulties: optionalText(data.difficulties, 'Сложности'),
    learned: optionalText(data.learned, 'Полученные знания'),
    additionalQuestions: optionalText(data.additionalQuestions, 'Дополнительные вопросы'),
  };
}

export function storyCreateInput(value: unknown) {
  const data = record(value, [...storyFields, 'tags', 'questionIds']);
  const story = storyInput(data);
  const tags = data.tags === undefined ? [] : listOfText(data.tags, 'Теги');
  const questionIds = data.questionIds === undefined ? [] : listOfText(data.questionIds, 'Вопросы');
  return {
    ...story,
    tags: Array.from(new Set(tags)),
    questionIds: Array.from(new Set(questionIds)),
  };
}

export const storyUpdateInput = storyCreateInput;

function listOfText(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) throw new InputError(`Поле «${field}» должно быть массивом.`);
  return value.map((item) => text(item, field));
}
