'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { projectsApi } from '@/client/projects';
import { AppShell } from '@/components/AppShell';
import { ProjectTechnologyWidget } from '@/components/projects/ProjectTechnologyWidget';
import type { ProjectInput, ProjectStep, ProjectTeamItem, ProjectTechnology } from '@/types';

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

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(initialForm);
  const [projectId, setProjectId] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const step = steps[stepIndex];

  function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function next() {
    if (step.id === 'title-color' && !form.title.trim()) return;
    setPending(true);
    setError('');
    try {
      const saved = projectId
        ? await projectsApi.update(projectId, form)
        : await projectsApi.create(form);
      setProjectId(saved.id);
      if (stepIndex === steps.length - 1) {
        await projectsApi.update(saved.id, { ...form, status: 'READY' });
        router.push(`/projects/${saved.id}`);
      } else setStepIndex((index) => index + 1);
    } catch {
      setError('Не удалось сохранить проект.');
    } finally {
      setPending(false);
    }
  }

  function resetStep() {
    const key = step.id === 'title-color' ? null : step.id;
    if (!key) setForm((current) => ({ ...current, title: '', color: '#70DECF' }));
    else if (key === 'technologies') update('technologies', []);
    else if (key === 'team') update('team', []);
    else update(key, [] as never);
  }

  return (
    <AppShell>
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
        {error && <Typography color="error">{error}</Typography>}
        <StepContent step={step.id} form={form} update={update} />
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Button startIcon={<RestartAltRoundedIcon />} onClick={resetStep}>
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
    </AppShell>
  );
}

function StepContent({
  step,
  form,
  update,
}: {
  step: ProjectStep;
  form: ProjectInput;
  update: <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => void;
}) {
  if (step === 'title-color')
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
  if (step === 'description')
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
  if (step === 'team')
    return <TeamEditor value={form.team} onChange={(value) => update('team', value)} />;
  if (step === 'technologies')
    return (
      <ProjectTechnologyWidget
        value={(form.technologies ?? []) as ProjectTechnology[]}
        onChange={(value) => update('technologies', value)}
      />
    );
  return (
    <ListEditor
      label={
        step === 'tasks' ? 'Задачи' : step === 'responsibilities' ? 'Обязанности' : 'Достижения'
      }
      value={form[step] as string[]}
      onChange={(value) => update(step, value)}
    />
  );
}

function ListEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <Stack gap={1.5}>
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
    <Stack gap={1.5}>
      {value.map((item, index) => (
        <Stack key={index} direction="row" gap={1}>
          <TextField
            label="Роль"
            value={item.name}
            onChange={(event) =>
              onChange(
                value.map((current, itemIndex) =>
                  itemIndex === index ? { ...current, name: event.target.value } : current,
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
                  itemIndex === index ? { ...current, count: Number(event.target.value) } : current,
                ),
              )
            }
          />
        </Stack>
      ))}
      <Button variant="outlined" onClick={() => onChange([...value, { name: '', count: 1 }])}>
        Добавить участника
      </Button>
    </Stack>
  );
}
