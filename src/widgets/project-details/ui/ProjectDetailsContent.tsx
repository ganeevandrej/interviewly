'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useState } from 'react';

import { ProjectDeleteFeature } from '@/features/project-delete';
import { ProjectEditFeature } from '@/features/project-edit';

import { ProjectReadView } from './ProjectReadView';

import type { Project } from '@/entities/project';
import type { ProjectTechnologyEditorRenderer } from '@/shared/types/project-technology-editor';

export function ProjectDetailsContent({
    initialProject,
    technologyEditor,
    questionsWidget,
}: {
    initialProject: Project;
    technologyEditor: ProjectTechnologyEditorRenderer;
    questionsWidget: (questions: Project['questions']) => React.ReactNode;
}) {
    const [project, setProject] = useState(initialProject);
    const [editing, setEditing] = useState(false);

    return (
        <>
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
                        technologyEditor={technologyEditor}
                    />
                ) : (
                    <ProjectReadView
                        project={project}
                        questionsWidget={questionsWidget(project.questions)}
                    />
                )}
            </Stack>
        </>
    );
}
