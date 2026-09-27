'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useState } from 'react';

import type { Project } from '@/entities/project';
import { ProjectDeleteFeature } from '@/features/project-delete';
import { ProjectEditFeature } from '@/features/project-edit';
import { AppShell } from '@/widgets/app-shell';

import { ProjectReadView } from './ProjectReadView';

export function ProjectDetailsContent({ initialProject }: { initialProject: Project }) {
    const [project, setProject] = useState(initialProject);
    const [editing, setEditing] = useState(false);

    return (
        <AppShell>
            <Stack gap={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Button component={Link} href="/projects" startIcon={<ArrowBackRoundedIcon />}>
                        Проекты
                    </Button>
                    {!editing && (
                        <Stack direction="row" gap={1}>
                            <Button
                                startIcon={<EditRoundedIcon />}
                                variant="outlined"
                                onClick={() => setEditing(true)}
                            >
                                Редактировать
                            </Button>
                            <ProjectDeleteFeature project={project} />
                        </Stack>
                    )}
                </Stack>
                {editing ? (
                    <ProjectEditFeature
                        project={project}
                        onSaved={(updatedProject) => {
                            setProject(updatedProject);
                            setEditing(false);
                        }}
                        onCancel={() => setEditing(false)}
                    />
                ) : (
                    <ProjectReadView project={project} />
                )}
            </Stack>
        </AppShell>
    );
}
