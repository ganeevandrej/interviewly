import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { AppShell } from '@/components/AppShell';

export default function Loading() {
  return (
    <AppShell>
      <Stack gap={3}>
        <Skeleton variant="text" width={160} height={36} />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Stack direction="row" gap={2} alignItems="center">
            <Skeleton variant="rounded" width={76} height={76} />
            <Stack>
              <Skeleton variant="text" width={240} height={52} />
              <Skeleton variant="text" width={120} />
            </Stack>
          </Stack>
          <Skeleton variant="rounded" width={180} height={42} />
        </Stack>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={100} />
        <Skeleton variant="rounded" height={100} />
      </Stack>
    </AppShell>
  );
}
