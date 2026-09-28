import { baseApi } from '@/shared/api/baseApi';

import type { Story, StoryInput } from '@/entities/story/model/types';

export const storiesApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
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
            query: (storyId) => ({
                url: `stories/${encodeURIComponent(storyId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, storyId) => [
                { type: 'Story', id: storyId },
                { type: 'Story', id: 'LIST' },
            ],
        }),
    }),
});

export const { useCreateStoryMutation, useUpdateStoryMutation, useDeleteStoryMutation } =
    storiesApi;
