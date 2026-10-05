'use client';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CategoryCard } from '@/entities/category';
import { CategoryCreateAdapter } from '@/features/category-create';
import { CategoryDeleteAdapter } from '@/features/category-delete';
import { AppShell } from '@/widgets/app-shell';

import { knowledgeBaseText } from '../constants/knowledgeBaseText';

import { CategoryListControls } from './CategoryListControls';
import { EmptyState } from './EmptyState';
import { KnowledgeBaseHeader } from './KnowledgeBaseHeader';
import { LoadError } from './LoadError';

import type { Category, CategorySummary } from '@/entities/category';

type KnowledgeBasePageProps = {
    initialCategories: CategorySummary[];
    hasLoadError?: boolean;
};

export default function KnowledgeBasePage({
    initialCategories,
    hasLoadError = false,
}: KnowledgeBasePageProps) {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [search, setSearch] = useState('');
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

    const normalizedSearch = search.trim().toLocaleLowerCase();
    const visibleCategories = normalizedSearch
        ? categories.filter((category) =>
              category.name.toLocaleLowerCase().includes(normalizedSearch),
          )
        : categories;
    const isLibraryEmpty = !categories.length && !hasLoadError;

    function addCategory(category: Category) {
        setCategories((items) => [...items, { ...category, topicsCount: 0, questionsCount: 0 }]);
    }

    function removeCategory(categoryId: string) {
        setCategories((items) => items.filter((category) => category.id !== categoryId));
    }

    return (
        <AppShell>
            <Stack gap={{ xs: 3, md: 3.5 }}>
                <KnowledgeBaseHeader
                    hidden={isLibraryEmpty}
                    onCreate={() => setCreateDialogOpen(true)}
                />
                {!isLibraryEmpty && !hasLoadError && (
                    <>
                        <CategoryListControls
                            search={search}
                            count={visibleCategories.length}
                            onSearchChange={setSearch}
                        />
                    </>
                )}
                {hasLoadError ? (
                    <LoadError onRetry={() => router.refresh()} />
                ) : visibleCategories.length ? (
                    <Grid container spacing={2}>
                        {visibleCategories.map((category) => (
                            <Grid item xs={12} sm={6} md={4} key={category.id}>
                                <CategoryCard
                                    category={category}
                                    action={
                                        <CategoryDeleteAdapter
                                            category={category}
                                            onDeleted={removeCategory}
                                        />
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : categories.length ? (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">{knowledgeBaseText.noSearchResults}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {knowledgeBaseText.noSearchResultsDescription}
                        </Typography>
                    </Paper>
                ) : (
                    <EmptyState onCreate={() => setCreateDialogOpen(true)} />
                )}
            </Stack>
            <CategoryCreateAdapter
                open={isCreateDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onCreated={addCategory}
            />
        </AppShell>
    );
}
