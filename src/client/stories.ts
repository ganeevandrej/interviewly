import type { Story, StoryInput } from '@/types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Не удалось выполнить запрос.');
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const storiesApi = {
  list: () => request<Story[]>('/api/stories'),
  read: (id: string) => request<Story>(`/api/stories/${id}`),
  create: (input: StoryInput) =>
    request<Story>('/api/stories', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: StoryInput) =>
    request<Story>(`/api/stories/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
};
