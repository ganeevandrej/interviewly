import { baseApi } from '@/shared/api/baseApi';

import type { Topic } from '@/entities/topic/model/types';

export const topicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createTopic: build.mutation<Topic, { categoryId: string; name: string }>({
            query: ({ categoryId, name }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/topics`,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: ['Library', 'Topic'],
        }),
        updateTopic: build.mutation<Topic, { categoryId: string; topicId: string; name: string }>({
            query: ({ categoryId, topicId, name }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/topics/${encodeURIComponent(topicId)}`,
                method: 'PUT',
                body: { name },
            }),
            invalidatesTags: ['Library', 'Topic'],
        }),
        deleteTopic: build.mutation<void, { categoryId: string; topicId: string }>({
            query: ({ categoryId, topicId }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/topics/${encodeURIComponent(topicId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Library', 'Topic', 'Question'],
        }),
    }),
});

export const { useCreateTopicMutation, useUpdateTopicMutation, useDeleteTopicMutation } = topicApi;
