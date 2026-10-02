import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { formatCount } from '../lib/formatCount';

import type { CategorySummary } from '../model/types';
import type { ReactNode } from 'react';

type CategoryCardProps = {
    category: CategorySummary;
    action?: ReactNode;
};

export function CategoryCard({ category, action }: CategoryCardProps) {
    return (
        <Paper variant="outlined" sx={{ minHeight: { xs: 154, md: 259 }, p: { xs: 2, md: 3 } }}>
            <Stack sx={{ display: { xs: 'none', md: 'flex' }, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box
                        sx={{
                            display: 'grid',
                            width: 44,
                            height: 44,
                            placeItems: 'center',
                            borderRadius: 1.5,
                            backgroundColor: category.accentColor,
                            color: 'primary.contrastText',
                        }}
                    >
                        <FolderOutlinedIcon />
                    </Box>
                    {action}
                </Stack>
                <Typography variant="h5" sx={{ mt: 2 }}>
                    {category.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    {formatCount(category.topicsCount, 'тема', 'темы', 'тем')} ·{' '}
                    {formatCount(category.questionsCount, 'вопрос', 'вопроса', 'вопросов')}
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        height: 4,
                        mt: 2,
                        borderRadius: 999,
                        backgroundColor: 'divider',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            width: 68,
                            height: '100%',
                            borderRadius: 'inherit',
                            backgroundColor: category.accentColor,
                        }}
                    />
                </Box>
                <Button
                    component={Link}
                    href={`/knowledge-base/category/${category.id}`}
                    variant="outlined"
                    sx={{ alignSelf: 'end', minWidth: 180, mt: 2.25 }}
                >
                    Открыть категорию
                </Button>
            </Stack>
            <Stack sx={{ display: { md: 'none' }, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" gap={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: category.accentColor,
                            }}
                        />
                        <Typography variant="h5">{category.name}</Typography>
                    </Stack>
                    {action}
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    {formatCount(category.topicsCount, 'тема', 'темы', 'тем')} ·{' '}
                    {formatCount(category.questionsCount, 'вопрос', 'вопроса', 'вопросов')}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Button
                    component={Link}
                    href={`/knowledge-base/category/${category.id}`}
                    variant="outlined"
                    sx={{ alignSelf: 'end', minWidth: 113, mt: 1.5 }}
                >
                    Открыть
                </Button>
            </Stack>
        </Paper>
    );
}
