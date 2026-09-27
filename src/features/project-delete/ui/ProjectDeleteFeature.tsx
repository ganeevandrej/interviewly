'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useDeleteProjectMutation } from '@/entities/project';

import type { Project } from '@/entities/project';

export function ProjectDeleteFeature({ project }: { project: Project }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [deleteProject, { isLoading }] = useDeleteProjectMutation();

    async function remove() {
        try {
            await deleteProject(project.id).unwrap();
            router.push('/projects');
        } catch {
            return;
        }
    }

    return (
        <>
            <Button color="error" disabled={isLoading} onClick={() => setOpen(true)}>
                Удалить
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Удалить проект?</DialogTitle>
                <DialogContent>
                    Проект «{project.title}» будет удалён без возможности восстановления.
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
