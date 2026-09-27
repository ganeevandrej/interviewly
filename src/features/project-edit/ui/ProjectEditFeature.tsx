'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import { useUpdateProjectMutation } from '@/entities/project';
import type { Project, ProjectInput } from '@/entities/project';
import type { ProjectTechnologyEditorRenderer } from '@/shared/types/project-technology-editor';

import { toProjectInput } from '../model/projectInput';
import { EditableList } from './EditableList';
import { TeamEditor } from './TeamEditor';

type Props = {
    project: Project;
    onSaved: (project: Project) => void;
    onCancel: () => void;
    technologyEditor: ProjectTechnologyEditorRenderer;
};

export function ProjectEditFeature({ project, onSaved, onCancel, technologyEditor }: Props) {
    const [value, setValue] = useState<ProjectInput>(() => toProjectInput(project));
    const [updateProject, { error, isLoading }] = useUpdateProjectMutation();

    async function save() {
        try {
            const updatedProject = await updateProject({ id: project.id, input: value }).unwrap();
            onSaved(updatedProject);
        } catch {
            return;
        }
    }

    return (
        <Stack gap={2}>
            {error && <div>Не удалось сохранить проект.</div>}
            <ProjectEditForm
                value={value}
                onChange={setValue}
                technologyEditor={technologyEditor}
            />
            <Stack direction="row" gap={1}>
                <Button disabled={isLoading} onClick={onCancel}>
                    Отмена
                </Button>
                <Button variant="contained" disabled={isLoading} onClick={save}>
                    Сохранить
                </Button>
            </Stack>
        </Stack>
    );
}

function ProjectEditForm({
    value,
    onChange,
    technologyEditor,
}: {
    value: ProjectInput;
    onChange: (value: ProjectInput) => void;
    technologyEditor: ProjectTechnologyEditorRenderer;
}) {
    return (
        <Stack gap={2}>
            <TextField
                label="Название"
                value={value.title}
                onChange={(event) => onChange({ ...value, title: event.target.value })}
            />
            <TextField
                label="Цвет"
                type="color"
                value={value.color}
                onChange={(event) => onChange({ ...value, color: event.target.value })}
            />
            <TextField
                label="Описание"
                value={value.description ?? ''}
                onChange={(event) => onChange({ ...value, description: event.target.value })}
                multiline
                minRows={5}
            />
            <TeamEditor value={value.team} onChange={(team) => onChange({ ...value, team })} />
            {technologyEditor({
                value: value.technologies ?? [],
                onChange: (technologies) => onChange({ ...value, technologies }),
            })}
            <EditableList
                label="Задачи"
                value={value.tasks}
                onChange={(tasks) => onChange({ ...value, tasks })}
            />
            <EditableList
                label="Обязанности"
                value={value.responsibilities}
                onChange={(responsibilities) => onChange({ ...value, responsibilities })}
            />
            <EditableList
                label="Достижения"
                value={value.achievements}
                onChange={(achievements) => onChange({ ...value, achievements })}
            />
        </Stack>
    );
}
