'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { GroupCard } from '@/entities/group/ui/GroupCard';
import { GroupDialog } from '@/features/manage-group/ui/GroupDialog';
import { useCreateGroupMutation } from '@/entities/group/api/groupApi';
import type { QuestionGroup } from '@/shared/types/library';

export default function HomePage({ initialGroups }: { initialGroups: QuestionGroup[] }) {
    const [groups, setGroups] = useState(initialGroups);
    const [createGroup, createState] = useCreateGroupMutation();
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
                busy={createState.isLoading}
                error={createState.error ? 'Не удалось создать группу.' : null}
                onSave={(payload) =>
                    createGroup(payload)
                        .unwrap()
                        .then((created) => {
                            setGroups((current) => [...current, created]);
                        })
                }
            />
        </AppShell>
    );
}
