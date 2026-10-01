import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

type ApiEnvelope<T> = { data: T };

const rawBaseQuery = fetchBaseQuery({
    baseUrl: '/api/',
    cache: 'no-store',
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
        const errorData = result.error.data;
        const message =
            typeof errorData === 'object' && errorData !== null && 'error' in errorData
                ? errorData.error
                : 'Не удалось выполнить запрос.';

        return {
            error: {
                ...result.error,
                data: typeof message === 'string' ? message : 'Не удалось выполнить запрос.',
            } as FetchBaseQueryError,
        };
    }

    const response = result.data as ApiEnvelope<unknown> | unknown;

    return {
        data:
            typeof response === 'object' && response !== null && 'data' in response
                ? response.data
                : response,
    };
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    keepUnusedDataFor: 60,
    tagTypes: ['Project', 'Story', 'Library', 'Category', 'Topic', 'Question', 'Training'],
    endpoints: () => ({}),
});
