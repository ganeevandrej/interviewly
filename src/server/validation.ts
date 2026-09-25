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

function stringList(value: unknown, field: string): string[] {
  return Array.from(new Set(listOfText(value, field)));
}

function teamList(value: unknown): { name: string; count: number }[] {
  if (!Array.isArray(value)) throw new InputError('Поле «Команда» должно быть массивом.');

  return value.map((item) => {
    const data = record(item, ['name', 'count']);

    if (typeof data.count !== 'number' || !Number.isFinite(data.count))
      throw new InputError('Количество участников команды должно быть числом.');

    return { name: text(data.name, 'Участник команды'), count: data.count };
  });
}

function projectTechnologies(value: unknown) {
  if (!Array.isArray(value)) throw new InputError('Поле «Технологии» должно быть массивом.');

  return value.map((item) => {
    const data = record(item, ['id', 'name', 'isFeatured']);
    const id = data.id === undefined || data.id === null ? undefined : text(data.id, 'Технология');
    const name = data.name === undefined ? undefined : text(data.name, 'Технология');

    if (!id && !name) throw new InputError('Укажите идентификатор или название технологии.');
    if (data.isFeatured !== undefined && typeof data.isFeatured !== 'boolean')
      throw new InputError('Признак избранной технологии должен быть логическим.');

    return { id, name, isFeatured: data.isFeatured ?? false };
  });
}

const projectFields = [
  'title',
  'color',
  'description',
  'team',
  'tasks',
  'responsibilities',
  'achievements',
  'status',
  'technologies',
] as const;

function projectText(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  return text(value, field);
}

export function projectInput(value: unknown) {
  const data = record(value, projectFields);

  if (data.status !== undefined && data.status !== 'DRAFT' && data.status !== 'READY')
    throw new InputError('Статус проекта должен быть DRAFT или READY.');

  return {
    title: text(data.title, 'Название'),
    color: projectText(data.color, 'Цвет'),
    description: projectText(data.description, 'Описание'),
    team: data.team === undefined || data.team === null ? [] : teamList(data.team),
    tasks: data.tasks === undefined || data.tasks === null ? [] : stringList(data.tasks, 'Задачи'),
    responsibilities:
      data.responsibilities === undefined || data.responsibilities === null
        ? []
        : stringList(data.responsibilities, 'Обязанности'),
    achievements:
      data.achievements === undefined || data.achievements === null
        ? []
        : stringList(data.achievements, 'Достижения'),
    status: data.status ?? 'DRAFT',
    technologies:
      data.technologies === undefined ? undefined : projectTechnologies(data.technologies),
  };
}

export const projectCreateInput = projectInput;
export const projectUpdateInput = projectInput;
