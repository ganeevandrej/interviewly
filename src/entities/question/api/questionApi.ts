import { baseApi } from '@/shared/api/baseApi';

import type { Question, QuestionInput } from '@/entities/question/model/types';

export const questionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createQuestion: build.mutation<Question, { categoryId: string; input: QuestionInput }>({
            query: ({ categoryId, input }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/questions`,
                method: 'POST',
                body: input,
            }),
            invalidatesTags: ['Library', 'Question'],
        }),
        updateQuestion: build.mutation<
            Question,
            { categoryId: string; questionId: string; input: QuestionInput }
        >({
            query: ({ categoryId, questionId, input }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/questions/${encodeURIComponent(questionId)}`,
                method: 'PUT',
                body: input,
            }),
            invalidatesTags: ['Library', 'Question'],
        }),
        deleteQuestion: build.mutation<void, { categoryId: string; questionId: string }>({
            query: ({ categoryId, questionId }) => ({
                url: `categories/${encodeURIComponent(categoryId)}/questions/${encodeURIComponent(questionId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Library', 'Question'],
        }),
    }),
});

export const { useCreateQuestionMutation, useUpdateQuestionMutation, useDeleteQuestionMutation } =
    questionApi;
