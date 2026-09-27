'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCreateProjectMutation, useUpdateProjectMutation } from '@/entities/project';
import type { ProjectInput, ProjectStep } from '@/entities/project';
import type { ProjectTechnologyEditorRenderer } from '@/shared/types/project-technology-editor';

import { StepContent } from './StepContent';

const steps: Array<{ id: ProjectStep; title: string }> = [
    { id: 'title-color', title: 'Название и цвет' },
    { id: 'description', title: 'Описание' },
    { id: 'team', title: 'Команда' },
    { id: 'technologies', title: 'Стек' },
    { id: 'tasks', title: 'Задачи' },
    { id: 'responsibilities', title: 'Обязанности' },
    { id: 'achievements', title: 'Достижения' },
];

const initialForm: ProjectInput = {
    title: '',
    color: '#70DECF',
    description: '',
    team: [],
    tasks: [],
    responsibilities: [],
    achievements: [],
    technologies: [],
};

export function ProjectCreateForm({
    technologyEditor,
}: {
    technologyEditor: ProjectTechnologyEditorRenderer;
}) {
    const router = useRouter();
    const [form, setForm] = useState<ProjectInput>(initialForm);
    const [projectId, setProjectId] = useState('');
    const [stepIndex, setStepIndex] = useState(0);
    const [createProject, { isLoading: isCreating, error: createError }] =
        useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating, error: updateError }] =
        useUpdateProjectMutation();
    const step = steps[stepIndex];
    const pending = isCreating || isUpdating;
    const error = createError || updateError;

    function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    async function next() {
        if (step.id === 'title-color' && !form.title.trim()) return;

        try {
            const saved = projectId
                ? await updateProject({ id: projectId, input: form }).unwrap()
                : await createProject(form).unwrap();

            setProjectId(saved.id);

            if (stepIndex === steps.length - 1) {
                await updateProject({ id: saved.id, input: { ...form, status: 'READY' } }).unwrap();
                router.push(`/projects/${saved.id}`);
                return;
            }

            setStepIndex((index) => index + 1);
        } catch {
            return;
        }
    }

    function resetStep() {
        const key = step.id === 'title-color' ? null : step.id;

        if (!key) {
            setForm((current) => ({ ...current, title: '', color: '#70DECF' }));
        } else if (key === 'technologies') {
            update('technologies', []);
        } else if (key === 'team') {
            update('team', []);
        } else {
            update(key, [] as never);
        }
    }

    return (
        <Stack gap={3} sx={{ maxWidth: 820, mx: 'auto' }}>
            <Button
                href="/projects"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{ alignSelf: 'flex-start' }}
            >
                Проекты
            </Button>
            <Stack gap={1}>
                <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                    Новый проект
                </Typography>
                <Typography color="text.secondary">
                    Шаг {stepIndex + 1} из {steps.length}: {step.title}
                </Typography>
            </Stack>
            {error && <Typography color="error">Не удалось сохранить проект.</Typography>}
            <StepContent
                step={step.id}
                form={form}
                update={update}
                technologyEditor={technologyEditor}
            />
            <Stack direction="row" justifyContent="space-between" gap={2}>
                <Button disabled={pending} startIcon={<RestartAltRoundedIcon />} onClick={resetStep}>
                    Сбросить
                </Button>
                <Stack direction="row" gap={1}>
                    <Button
                        disabled={stepIndex === 0 || pending}
                        onClick={() => setStepIndex((index) => index - 1)}
                    >
                        Назад
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={next}
                        disabled={pending || (step.id === 'title-color' && !form.title.trim())}
                    >
                        {stepIndex === steps.length - 1 ? 'Завершить' : 'Далее'}
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
}
