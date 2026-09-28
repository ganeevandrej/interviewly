import { baseApi } from '@/shared/api/baseApi';

import type { QuestionGroup } from '@/entities/group/model/types';

export const groupApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createGroup: build.mutation<QuestionGroup, Omit<QuestionGroup, 'id'>>({
            query: (body) => ({ url: 'groups', method: 'POST', body }),
            invalidatesTags: ['Library', 'Group', 'Topic'],
        }),
        updateGroup: build.mutation<
            QuestionGroup,
            { id: string; input: Omit<QuestionGroup, 'id'> }
        >({
            query: ({ id, input }) => ({
                url: `groups/${encodeURIComponent(id)}`,
                method: 'PUT',
                body: input,
            }),
            invalidatesTags: ['Library', 'Group', 'Topic', 'Question'],
        }),
        deleteGroup: build.mutation<void, string>({
            query: (id) => ({ url: `groups/${encodeURIComponent(id)}`, method: 'DELETE' }),
            invalidatesTags: ['Library', 'Group', 'Topic', 'Question'],
        }),
    }),
});

export const { useCreateGroupMutation, useUpdateGroupMutation, useDeleteGroupMutation } = groupApi;
