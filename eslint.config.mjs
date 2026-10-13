import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import fsdPlugin from 'eslint-plugin-fsd-lint';
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
            'next-env.d.ts',
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
        files: [
            'src/app/**/*.{js,jsx,ts,tsx}',
            'src/entities/**/*.{js,jsx,ts,tsx}',
            'src/features/**/*.{js,jsx,ts,tsx}',
            'src/shared/**/*.{js,jsx,ts,tsx}',
            'src/views/**/*.{js,jsx,ts,tsx}',
            'src/widgets/**/*.{js,jsx,ts,tsx}',
        ],
        ...fsdPlugin.configs.recommended,
        rules: {
            'fsd/forbidden-imports': 'warn',
            'fsd/no-cross-slice-dependency': 'warn',
            'fsd/no-global-store-imports': 'warn',
            'fsd/no-public-api-sidestep': 'warn',
            'fsd/no-relative-imports': 'warn',
            'fsd/no-ui-in-business-logic': 'warn',
            'fsd/ordered-imports': 'warn',
        },
    },

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
            'import/order': 'off',
        },
    },
]);
