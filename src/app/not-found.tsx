import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { AppShell } from '@/components/AppShell';

export default function NotFound() {
  return (
    <AppShell>
      <Stack gap={2} alignItems="flex-start">
        <Typography variant="h3">Страница не найдена</Typography>
        <Typography color="text.secondary">
          Возможно, ссылка устарела или запрошенный материал был удалён.
        </Typography>
        <Button component={Link} href="/" variant="contained">
          Вернуться на главную
        </Button>
      </Stack>
    </AppShell>
  );
}
