'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { AppShell } from '@/components/AppShell';
import { GroupCard } from '@/components/GroupCard';
import { GroupDialog } from '@/components/GroupDialog';
import { useCreateGroupMutation } from '@/services/libraryApi';
import type { QuestionGroup } from '@/types';

export default function HomePage({ initialGroups }: { initialGroups: QuestionGroup[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [createGroup] = useCreateGroupMutation();
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  return (
    <AppShell onCreate={() => setGroupDialogOpen(true)}>
      <Stack gap={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
            Мои группы
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setGroupDialogOpen(true)}
          >
            Создать группу
          </Button>
        </Stack>
        {!groups.length && (
          <Typography color="text.secondary">
            Групп пока нет. Создайте первую группу.
          </Typography>
        )}
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} md={6} lg={4} key={group.id}>
              <GroupCard group={group} />
            </Grid>
          ))}
        </Grid>
      </Stack>

      <GroupDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        onSave={(payload) =>
          createGroup(payload).unwrap().then((created) => {
            setGroups((current) => [...current, created]);
          })
        }
      />
    </AppShell>
  );
}
