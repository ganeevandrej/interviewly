import { api } from '@/services/api';
import type { Question, QuestionGroup, QuestionInput, Topic } from '@/types';

export const libraryApi = api.injectEndpoints({
  endpoints: (build) => ({
    createGroup: build.mutation<QuestionGroup, Omit<QuestionGroup, 'id'>>({
      query: (body) => ({ url: 'groups', method: 'POST', body }),
      invalidatesTags: ['Library', 'Group', 'Topic'],
    }),
    updateGroup: build.mutation<QuestionGroup, { id: string; input: Omit<QuestionGroup, 'id'> }>({
      query: ({ id, input }) => ({ url: `groups/${encodeURIComponent(id)}`, method: 'PUT', body: input }),
      invalidatesTags: ['Library', 'Group', 'Topic', 'Question'],
    }),
    deleteGroup: build.mutation<void, string>({
      query: (id) => ({ url: `groups/${encodeURIComponent(id)}`, method: 'DELETE' }),
      invalidatesTags: ['Library', 'Group', 'Topic', 'Question'],
    }),
    createTopic: build.mutation<Topic, { groupId: string; name: string }>({
      query: ({ groupId, name }) => ({ url: `groups/${encodeURIComponent(groupId)}/topics`, method: 'POST', body: { name } }),
      invalidatesTags: ['Library', 'Topic'],
    }),
    updateTopic: build.mutation<Topic, { groupId: string; topicId: string; name: string }>({
      query: ({ groupId, topicId, name }) => ({ url: `groups/${encodeURIComponent(groupId)}/topics/${encodeURIComponent(topicId)}`, method: 'PUT', body: { name } }),
      invalidatesTags: ['Library', 'Topic'],
    }),
    deleteTopic: build.mutation<void, { groupId: string; topicId: string }>({
      query: ({ groupId, topicId }) => ({ url: `groups/${encodeURIComponent(groupId)}/topics/${encodeURIComponent(topicId)}`, method: 'DELETE' }),
      invalidatesTags: ['Library', 'Topic', 'Question'],
    }),
    createQuestion: build.mutation<Question, { groupId: string; input: QuestionInput }>({
      query: ({ groupId, input }) => ({ url: `groups/${encodeURIComponent(groupId)}/questions`, method: 'POST', body: input }),
      invalidatesTags: ['Library', 'Question'],
    }),
    updateQuestion: build.mutation<Question, { groupId: string; questionId: string; input: QuestionInput }>({
      query: ({ groupId, questionId, input }) => ({ url: `groups/${encodeURIComponent(groupId)}/questions/${encodeURIComponent(questionId)}`, method: 'PUT', body: input }),
      invalidatesTags: ['Library', 'Question'],
    }),
    deleteQuestion: build.mutation<void, { groupId: string; questionId: string }>({
      query: ({ groupId, questionId }) => ({ url: `groups/${encodeURIComponent(groupId)}/questions/${encodeURIComponent(questionId)}`, method: 'DELETE' }),
      invalidatesTags: ['Library', 'Question'],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = libraryApi;
