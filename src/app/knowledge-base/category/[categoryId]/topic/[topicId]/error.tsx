'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AppShell } from '@/widgets/app-shell';

export default function TopicDetailsError({ reset }: { reset: () => void }) {
    return (
        <AppShell>
            <Stack gap={2} alignItems="flex-start">
                <Typography variant="h4">Не удалось загрузить тему</Typography>
                <Typography color="text.secondary">
                    Проверьте подключение и попробуйте открыть тему ещё раз.
                </Typography>
                <Button variant="contained" onClick={reset}>
                    Повторить
                </Button>
            </Stack>
        </AppShell>
    );
}
