import { baseApi } from '@/shared/api/baseApi';

import type { Category } from '../model/types';

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createCategory: build.mutation<Category, Omit<Category, 'id'>>({
            query: (body) => ({ url: 'categories', method: 'POST', body }),
            invalidatesTags: ['Library', 'Category'],
        }),
        updateCategory: build.mutation<Category, { id: string; input: Omit<Category, 'id'> }>({
            query: ({ id, input }) => ({
                url: `categories/${encodeURIComponent(id)}`,
                method: 'PUT',
                body: input,
            }),
            invalidatesTags: ['Library', 'Category', 'Topic', 'Question'],
        }),
        deleteCategory: build.mutation<void, string>({
            query: (id) => ({ url: `categories/${encodeURIComponent(id)}`, method: 'DELETE' }),
            invalidatesTags: ['Library', 'Category', 'Topic', 'Question', 'Training'],
        }),
    }),
});

export const { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } =
    categoryApi;
