import { baseApi } from '@/shared/api/baseApi';

import type { Training, TrainingInput } from '../model/types';

export const trainingApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createTraining: build.mutation<Training, TrainingInput>({
            query: (body) => ({ url: 'trainings', method: 'POST', body }),
            invalidatesTags: ['Training'],
        }),
        updateTraining: build.mutation<Training, { id: string; input: TrainingInput }>({
            query: ({ id, input }) => ({ url: 'trainings/' + encodeURIComponent(id), method: 'PUT', body: input }),
            invalidatesTags: (_result, _error, { id }) => ['Training', { type: 'Training', id }],
        }),
        deleteTraining: build.mutation<void, string>({
            query: (id) => ({ url: 'trainings/' + encodeURIComponent(id), method: 'DELETE' }),
            invalidatesTags: ['Training'],
        }),
        startTraining: build.mutation<Training, string>({
            query: (id) => ({ url: 'trainings/' + encodeURIComponent(id) + '/start', method: 'POST' }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Training', id }],
        }),
        restartTraining: build.mutation<Training, string>({
            query: (id) => ({ url: 'trainings/' + encodeURIComponent(id) + '/restart', method: 'POST' }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Training', id }],
        }),
        regenerateTraining: build.mutation<Training, string>({
            query: (id) => ({ url: 'trainings/' + encodeURIComponent(id) + '/regenerate', method: 'POST' }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Training', id }],
        }),
    }),
});

export const {
    useCreateTrainingMutation,
    useUpdateTrainingMutation,
    useDeleteTrainingMutation,
    useStartTrainingMutation,
    useRestartTrainingMutation,
    useRegenerateTrainingMutation,
} = trainingApi;
