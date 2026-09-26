import { api } from '@/services/api';
import type { Story, StoryInput } from '@/types';

export const storiesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStories: build.query<Story[], void>({
      query: () => 'stories',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Story' as const, id })), { type: 'Story' as const, id: 'LIST' }]
          : [{ type: 'Story' as const, id: 'LIST' }],
    }),
    getStory: build.query<Story, string>({
      query: (storyId) => `stories/${encodeURIComponent(storyId)}`,
      providesTags: (_result, _error, storyId) => [{ type: 'Story', id: storyId }],
    }),
    createStory: build.mutation<Story, StoryInput>({
      query: (body) => ({ url: 'stories', method: 'POST', body }),
      invalidatesTags: [{ type: 'Story', id: 'LIST' }],
    }),
    updateStory: build.mutation<Story, { storyId: string; body: StoryInput }>({
      query: ({ storyId, body }) => ({
        url: `stories/${encodeURIComponent(storyId)}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { storyId }) => [
        { type: 'Story', id: storyId },
        { type: 'Story', id: 'LIST' },
      ],
    }),
    deleteStory: build.mutation<void, string>({
      query: (storyId) => ({ url: `stories/${encodeURIComponent(storyId)}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, storyId) => [
        { type: 'Story', id: storyId },
        { type: 'Story', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetStoriesQuery,
  useGetStoryQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} = storiesApi;
