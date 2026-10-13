import type { Topic, TopicDeletionImpact } from '@/entities/topic/model/types';
import { baseApi } from '@/shared/api/baseApi';

export const topicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createTopic: build.mutation<
            Topic,
            { categoryId: string; name: string; accentColor: string }
        >({
            query: ({ categoryId, name, accentColor }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/topics`,
                method: 'POST',
                body: { name, accentColor },
            }),
            invalidatesTags: ['Library', 'Topic'],
        }),
        updateTopic: build.mutation<
            Topic,
            { categoryId: string; topicId: string; name: string; accentColor: string }
        >({
            query: ({ categoryId, topicId, name, accentColor }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/topics/${encodeURIComponent(topicId)}`,
                method: 'PUT',
                body: { name, accentColor },
            }),
            invalidatesTags: ['Library', 'Topic'],
        }),
        getTopicDeletionImpact: build.query<
            TopicDeletionImpact,
            { categoryId: string; topicId: string }
        >({
            query: ({ categoryId, topicId }) =>
                `categories/${encodeURIComponent(categoryId)}/topics/${encodeURIComponent(topicId)}/deletion-impact`,
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

export const {
    useCreateTopicMutation,
    useUpdateTopicMutation,
    useLazyGetTopicDeletionImpactQuery,
    useDeleteTopicMutation,
} = topicApi;
