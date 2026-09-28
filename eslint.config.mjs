import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default defineConfig([
    {
        ignores: [
            '.agents/**',
            '.next/**',
            'node_modules/**',
            'dist/**',
            'build/**',
            'coverage/**',
            'generated/**',
            'src/generated/**',
            'prisma/generated/**',
        ],
    },

    ...compat.extends('next/core-web-vitals'),

    ...tseslint.configs.recommended,

    {
        files: ['**/*.cjs'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    {
        plugins: {
            import: importPlugin,
        },

        rules: {
            'prefer-arrow-callback': 'error',

            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'type',
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
]);