import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { AppShell } from '@/components/AppShell';

export default function Loading() {
  return (
    <AppShell>
      <Stack gap={3}>
        <Skeleton variant="text" width={280} height={56} />
        <Skeleton variant="rounded" height={56} />
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Skeleton variant="rounded" height={132} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={132} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={132} sx={{ flex: 1 }} />
        </Stack>
      </Stack>
    </AppShell>
  );
}
