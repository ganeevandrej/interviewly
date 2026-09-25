import type { Project, ProjectInput, ProjectListItem } from '@/types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Не удалось выполнить запрос.');
  }

  if (response.status === 204) return undefined as T;

  const body = (await response.json()) as { data: T };

  return body.data;
}

export const projectsApi = {
  list: () => request<ProjectListItem[]>('/api/projects'),
  read: (id: string) => request<Project>(`/api/projects/${id}`),
  create: (input: ProjectInput) =>
    request<Project>('/api/projects', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: ProjectInput) =>
    request<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  delete: (id: string) => request<void>(`/api/projects/${id}`, { method: 'DELETE' }),
  addQuestion: (id: string, questionId: string) =>
    request<Project>(`/api/projects/${id}/questions`, {
      method: 'POST',
      body: JSON.stringify({ questionId }),
    }),
  removeQuestion: (id: string, questionId: string) =>
    request<void>(`/api/projects/${id}/questions/${questionId}`, { method: 'DELETE' }),
};
