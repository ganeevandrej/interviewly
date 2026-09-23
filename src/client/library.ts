import { InterviewlyData, LibraryGroup } from '@/types';

export function flattenLibrary(groups: LibraryGroup[]): InterviewlyData {
  return {
    groups: groups.map(({ topics: _topics, ...group }) => group),
    topics: groups.flatMap((group) =>
      group.topics.map(({ questions: _questions, ...topic }) => topic),
    ),
    questions: groups.flatMap((group) =>
      group.topics.flatMap((topic) =>
        topic.questions.map((question) => ({ ...question, groupId: group.id })),
      ),
    ),
  };
}
export async function apiRequest<T>(
  path: string,
  method = 'GET',
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      cache: 'no-store',
      signal,
      ...(body === undefined
        ? {}
        : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Не удалось связаться с сервером. Проверьте соединение и повторите попытку.');
  }
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      typeof result?.error === 'string'
        ? result.error
        : 'Не удалось выполнить запрос. Попробуйте ещё раз.',
    );
  }
  if (response.status === 204) return undefined as T;
  const result = await response.json();
  return result.data as T;
}
