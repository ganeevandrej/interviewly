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
