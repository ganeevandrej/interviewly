'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import { useUpdateProjectMutation } from '@/entities/project';
import type { Project, ProjectInput, ProjectTeamItem } from '@/entities/project';
import { ProjectTechnologyEditor } from '@/features/project-technology-edit';

type Props = {
    project: Project;
    onSaved: (project: Project) => void;
    onCancel: () => void;
};

export function ProjectEditFeature({ project, onSaved, onCancel }: Props) {
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
            <ProjectEditForm value={value} onChange={setValue} />
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

function toProjectInput(project: Project): ProjectInput {
    return {
        title: project.title,
        color: project.color,
        description: project.description,
        team: project.team,
        tasks: project.tasks,
        responsibilities: project.responsibilities,
        achievements: project.achievements,
        technologies: project.technologies.map((item) => ({ ...item })),
        status: project.status,
    };
}

function ProjectEditForm({
    value,
    onChange,
}: {
    value: ProjectInput;
    onChange: (value: ProjectInput) => void;
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
            <ProjectTechnologyEditor
                value={value.technologies ?? []}
                onChange={(technologies) => onChange({ ...value, technologies })}
            />
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

function TeamEditor({
    value,
    onChange,
}: {
    value: ProjectTeamItem[];
    onChange: (value: ProjectTeamItem[]) => void;
}) {
    return (
        <FieldGroup title="Команда">
            {value.map((item, index) => (
                <Stack key={index} direction="row" gap={1}>
                    <TextField
                        label="Роль"
                        value={item.name}
                        onChange={(event) =>
                            onChange(
                                value.map((current, itemIndex) =>
                                    itemIndex === index
                                        ? { ...current, name: event.target.value }
                                        : current,
                                ),
                            )
                        }
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={item.count}
                        onChange={(event) =>
                            onChange(
                                value.map((current, itemIndex) =>
                                    itemIndex === index
                                        ? { ...current, count: Number(event.target.value) }
                                        : current,
                                ),
                            )
                        }
                    />
                </Stack>
            ))}
            <Button variant="outlined" onClick={() => onChange([...value, { name: '', count: 1 }])}>
                Добавить участника
            </Button>
        </FieldGroup>
    );
}

function EditableList({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
}) {
    return (
        <FieldGroup title={label}>
            {value.map((item, index) => (
                <TextField
                    key={index}
                    label={`${label} ${index + 1}`}
                    value={item}
                    onChange={(event) =>
                        onChange(
                            value.map((current, itemIndex) =>
                                itemIndex === index ? event.target.value : current,
                            ),
                        )
                    }
                />
            ))}
            <Button variant="outlined" onClick={() => onChange([...value, ''])}>
                Добавить пункт
            </Button>
        </FieldGroup>
    );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Stack gap={1}>
            <strong>{title}</strong>
            {children}
        </Stack>
    );
}
