import { api } from '@/services/api';
import type { Project, ProjectInput, ProjectListItem } from '@/types';

export const projectsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<ProjectListItem[], void>({
      query: () => 'projects',
      providesTags: ['Project'],
    }),
    getProject: build.query<Project, string>({
      query: (id) => `projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    createProject: build.mutation<Project, ProjectInput>({
      query: (body) => ({ url: 'projects', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),
    updateProject: build.mutation<Project, { id: string; input: ProjectInput }>({
      query: ({ id, input }) => ({ url: `projects/${id}`, method: 'PUT', body: input }),
      invalidatesTags: (_result, _error, { id }) => ['Project', { type: 'Project', id }],
    }),
    deleteProject: build.mutation<void, string>({
      query: (id) => ({ url: `projects/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => ['Project', { type: 'Project', id }],
    }),
    addProjectQuestion: build.mutation<Project, { id: string; questionId: string }>({
      query: ({ id, questionId }) => ({
        url: `projects/${id}/questions`,
        method: 'POST',
        body: { questionId },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }],
    }),
    removeProjectQuestion: build.mutation<void, { id: string; questionId: string }>({
      query: ({ id, questionId }) => ({
        url: `projects/${id}/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddProjectQuestionMutation,
  useRemoveProjectQuestionMutation,
} = projectsApi;
