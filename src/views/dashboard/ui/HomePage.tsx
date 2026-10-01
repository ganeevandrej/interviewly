'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { AppShell } from '@/widgets/app-shell';

import type { Training } from '@/entities/training';

export default function HomePage({ trainings }: { trainings: Training[] }) {
    return (
        <AppShell>
            <Stack gap={4}>
                <Stack gap={1}>
                    <Typography variant="h3">Главная</Typography>
                    <Typography color="text.secondary">
                        Продолжайте подготовку там, где остановились.
                    </Typography>
                </Stack>
                <TextField
                    label="Поиск"
                    placeholder="Поиск скоро появится"
                    disabled
                    InputProps={{ startAdornment: <SearchRoundedIcon sx={{ mr: 1 }} /> }}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Button
                        component={Link}
                        href="/knowledge-base"
                        variant="outlined"
                        endIcon={<ArrowOutwardRoundedIcon />}
                    >
                        База знаний
                    </Button>
                    <Button
                        component={Link}
                        href="/stories"
                        variant="outlined"
                        endIcon={<ArrowOutwardRoundedIcon />}
                    >
                        Истории
                    </Button>
                    <Button
                        component={Link}
                        href="/projects"
                        variant="outlined"
                        endIcon={<ArrowOutwardRoundedIcon />}
                    >
                        Проекты
                    </Button>
                    <Button
                        component={Link}
                        href="/interview"
                        variant="outlined"
                        endIcon={<ArrowOutwardRoundedIcon />}
                    >
                        Собеседование
                    </Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Тренировки</Typography>
                    <Button
                        component={Link}
                        href="/trainings/new"
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                    >
                        Создать
                    </Button>
                </Stack>
                {trainings.length ? (
                    <Stack gap={1}>
                        {trainings.map((training) => (
                            <Paper key={training.id} variant="outlined" sx={{ p: 2 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    gap={2}
                                >
                                    <Stack>
                                        <Typography>{training.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {training.status === 'COMPLETED'
                                                ? 'Пройдена'
                                                : 'В работе'}{' '}
                                            ·{' '}
                                            {
                                                training.questions.filter(
                                                    (question) => question.status === 'ACCEPTED',
                                                ).length
                                            }{' '}
                                            из {training.questions.length}
                                        </Typography>
                                    </Stack>
                                    <Button component={Link} href={`/trainings/${training.id}`}>
                                        Открыть
                                    </Button>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Typography color="text.secondary">Тренировок пока нет.</Typography>
                )}
            </Stack>
        </AppShell>
    );
}
