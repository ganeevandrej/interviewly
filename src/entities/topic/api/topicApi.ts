import { baseApi } from '@/shared/api/baseApi';
import type { Topic } from '@/entities/topic/model/types';

export const topicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createTopic: build.mutation<Topic, { groupId: string; name: string }>({
            query: ({ groupId, name }) => ({
                url: `groups/${encodeURIComponent(groupId)}/topics`,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: ['Library', 'Topic'],
        }),
        updateTopic: build.mutation<Topic, { groupId: string; topicId: string; name: string }>({
            query: ({ groupId, topicId, name }) => ({
                url: `groups/${encodeURIComponent(groupId)}/topics/${encodeURIComponent(topicId)}`,
                method: 'PUT',
                body: { name },
            }),
            invalidatesTags: ['Library', 'Topic'],
        }),
        deleteTopic: build.mutation<void, { groupId: string; topicId: string }>({
            query: ({ groupId, topicId }) => ({
                url: `groups/${encodeURIComponent(groupId)}/topics/${encodeURIComponent(topicId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Library', 'Topic', 'Question'],
        }),
    }),
});

export const { useCreateTopicMutation, useUpdateTopicMutation, useDeleteTopicMutation } = topicApi;
