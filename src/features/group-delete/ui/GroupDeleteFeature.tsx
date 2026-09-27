'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useDeleteGroupMutation } from '@/entities/group';

export function GroupDeleteFeature({ groupId }: { groupId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [deleteGroup, { isLoading }] = useDeleteGroupMutation();

    async function remove() {
        try {
            await deleteGroup(groupId).unwrap();
            router.push('/');
        } catch {
            return;
        }
    }

    return (
        <>
            <Button disabled={isLoading} color="error" onClick={() => setOpen(true)}>
                Удалить
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Удалить группу?</DialogTitle>
                <DialogContent>
                    Группа и её вопросы будут удалены без возможности восстановления.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                    <Button color="error" variant="contained" onClick={remove} disabled={isLoading}>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
