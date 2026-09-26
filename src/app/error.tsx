'use client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AppShell } from '@/components/AppShell';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AppShell>
      <Stack gap={2} alignItems="flex-start">
        <Typography variant="h4">Не удалось загрузить страницу</Typography>
        <Alert severity="error">Попробуйте повторить загрузку.</Alert>
        <Button variant="contained" onClick={reset}>
          Повторить
        </Button>
      </Stack>
    </AppShell>
  );
}
