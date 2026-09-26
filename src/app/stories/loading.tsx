import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { AppShell } from '@/components/AppShell';

export default function Loading() {
  return (
    <AppShell>
      <Stack gap={3}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Skeleton variant="text" width={220} height={56} />
          <Skeleton variant="rounded" width={180} height={42} />
        </Stack>
        <Skeleton variant="rounded" height={92} />
        <Skeleton variant="rounded" height={92} />
        <Skeleton variant="rounded" height={92} />
      </Stack>
    </AppShell>
  );
}
