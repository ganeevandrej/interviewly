'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { ProjectInput, ProjectStep, ProjectTechnology } from '@/entities/project';
import type { ProjectTechnologyEditorRenderer } from '@/shared/types/project-technology-editor';

import { ListEditor } from './ListEditor';
import { TeamEditor } from './TeamEditor';

export function StepContent({
    step,
    form,
    update,
    technologyEditor,
}: {
    step: ProjectStep;
    form: ProjectInput;
    update: <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => void;
    technologyEditor: ProjectTechnologyEditorRenderer;
}) {
    if (step === 'title-color') {
        return (
            <Stack gap={2}>
                <TextField
                    label="Название"
                    value={form.title}
                    onChange={(event) => update('title', event.target.value)}
                    required
                />
                <TextField
                    label="Цвет"
                    type="color"
                    value={form.color}
                    onChange={(event) => update('color', event.target.value)}
                />
            </Stack>
        );
    }

    if (step === 'description') {
        return (
            <TextField
                label="Описание"
                value={form.description ?? ''}
                onChange={(event) => update('description', event.target.value)}
                multiline
                minRows={7}
                fullWidth
            />
        );
    }

    if (step === 'team') {
        return <TeamEditor value={form.team} onChange={(value) => update('team', value)} />;
    }

    if (step === 'technologies') {
        return technologyEditor({
            value: (form.technologies ?? []) as ProjectTechnology[],
            onChange: (value) => update('technologies', value),
        });
    }

    return (
        <ListEditor
            label={
                step === 'tasks'
                    ? 'Задачи'
                    : step === 'responsibilities'
                      ? 'Обязанности'
                      : 'Достижения'
            }
            value={form[step] as string[]}
            onChange={(value) => update(step, value)}
        />
    );
}
