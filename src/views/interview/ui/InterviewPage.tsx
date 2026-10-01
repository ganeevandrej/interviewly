'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AppShell } from '@/widgets/app-shell';

const levels = [
    ['Лёгкий', 'Короткие вопросы для разминки.'],
    ['Средний', 'Стандартный темп интервью.'],
    ['Сложный', 'Больше времени на глубокие ответы.'],
];

export default function InterviewPage() {
    return (
        <AppShell>
            <Stack gap={3}>
                <Typography variant="h3">Собеседование</Typography>
                <Typography color="text.secondary">
                    Выберите сложность. Голосовая сессия и автоматический переход по таймауту
                    появятся следующим этапом.
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                    {levels.map(([title, description]) => (
                        <Paper key={title} variant="outlined" sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h5">{title}</Typography>
                            <Typography color="text.secondary">{description}</Typography>
                        </Paper>
                    ))}
                </Stack>
            </Stack>
        </AppShell>
    );
}
