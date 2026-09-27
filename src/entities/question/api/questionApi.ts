import { baseApi } from '@/shared/api/baseApi';
import type { Question, QuestionInput } from '@/entities/question/model/types';

export const questionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createQuestion: build.mutation<Question, { groupId: string; input: QuestionInput }>({
            query: ({ groupId, input }) => ({
                url: `groups/${encodeURIComponent(groupId)}/questions`,
                method: 'POST',
                body: input,
            }),
            invalidatesTags: ['Library', 'Question'],
        }),
        updateQuestion: build.mutation<
            Question,
            { groupId: string; questionId: string; input: QuestionInput }
        >({
            query: ({ groupId, questionId, input }) => ({
                url: `groups/${encodeURIComponent(groupId)}/questions/${encodeURIComponent(questionId)}`,
                method: 'PUT',
                body: input,
            }),
            invalidatesTags: ['Library', 'Question'],
        }),
        deleteQuestion: build.mutation<void, { groupId: string; questionId: string }>({
            query: ({ groupId, questionId }) => ({
                url: `groups/${encodeURIComponent(groupId)}/questions/${encodeURIComponent(questionId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Library', 'Question'],
        }),
    }),
});

export const { useCreateQuestionMutation, useUpdateQuestionMutation, useDeleteQuestionMutation } =
    questionApi;
