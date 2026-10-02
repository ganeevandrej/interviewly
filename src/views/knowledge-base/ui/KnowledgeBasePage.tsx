'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CategoryCard, formatCount } from '@/entities/category';
import { CategoryCreateDialog } from '@/features/category-create';
import { CategoryDeleteFeature } from '@/features/category-delete';
import { AppShell } from '@/widgets/app-shell';

import { EmptyState } from './EmptyState';
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
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    gap={2}
                >
                    <Box sx={{ maxWidth: 720 }}>
                        <Typography variant="h3">База знаний</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Создавайте категории, собирайте темы и вопросы — всё необходимое для
                            системной подготовки.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{
                            display: {
                                xs: isLibraryEmpty ? 'none' : 'inline-flex',
                                sm: 'inline-flex',
                            },
                        }}
                    >
                        Создать категорию
                    </Button>
                </Stack>
                {!isLibraryEmpty && !hasLoadError && (
                    <>
                        <TextField
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Поиск категорий по названию"
                            inputProps={{ 'aria-label': 'Поиск категорий по названию' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4">Категории</Typography>
                            <Typography color="text.secondary">
                                {formatCount(
                                    visibleCategories.length,
                                    'категория',
                                    'категории',
                                    'категорий',
                                )}
                            </Typography>
                        </Stack>
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
                                        <CategoryDeleteFeature
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
                        <Typography variant="h6">Категории не найдены</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Попробуйте изменить поисковый запрос.
                        </Typography>
                    </Paper>
                ) : (
                    <EmptyState onCreate={() => setCreateDialogOpen(true)} />
                )}
            </Stack>
            <CategoryCreateDialog
                open={isCreateDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onCreated={addCategory}
            />
        </AppShell>
    );
}
