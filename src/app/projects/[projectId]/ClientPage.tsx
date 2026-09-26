'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import { ProjectQuestionsWidget } from '@/components/projects/ProjectQuestionsWidget';
import { ProjectTechnologyWidget } from '@/components/projects/ProjectTechnologyWidget';
import {
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from '@/services/projectsApi';
import type { Project, ProjectInput, ProjectTeamItem } from '@/types';

export default function ProjectPage({ initialProject }: { initialProject: Project }) {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [draft, setDraft] = useState<ProjectInput | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const [updateProject, { error: updateError }] = useUpdateProjectMutation();
  const [deleteProject, { error: deleteError }] = useDeleteProjectMutation();
  const queryError = null;
  const isLoading = false;

  if (queryError)
    return (
      <AppShell>
        <Typography color="error">Не удалось загрузить проект.</Typography>
      </AppShell>
    );
  if (isLoading || !project)
    return (
      <AppShell>
        <Typography color="text.secondary">Загрузка проекта…</Typography>
      </AppShell>
    );

  const currentProject = project;

  function startEdit() {
    setDraft({
      title: currentProject.title,
      color: currentProject.color,
      description: currentProject.description,
      team: currentProject.team,
      tasks: currentProject.tasks,
      responsibilities: currentProject.responsibilities,
      achievements: currentProject.achievements,
      technologies: currentProject.technologies.map((item) => ({ ...item })),
      status: currentProject.status,
    });
    setEditing(true);
  }

  async function save() {
    if (!draft) return;
    try {
      const updatedProject = await updateProject({ id: currentProject.id, input: draft }).unwrap();
      setProject(updatedProject);
      setDraft(null);
      setEditing(false);
    } catch {
      return;
    }
  }

  async function remove() {
    try {
      await deleteProject(currentProject.id).unwrap();
      router.push('/projects');
    } catch {
      return;
    }
  }

  return (
    <AppShell>
      <Stack gap={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Button component={Link} href="/projects" startIcon={<ArrowBackRoundedIcon />}>
            Проекты
          </Button>
          <Stack direction="row" gap={1}>
            {editing ? (
              <>
                <Button
                  onClick={() => {
                    setDraft(null);
                    setEditing(false);
                  }}
                >
                  Отмена
                </Button>
                <Button variant="contained" onClick={save}>
                  Сохранить
                </Button>
              </>
            ) : (
              <Button startIcon={<EditRoundedIcon />} variant="outlined" onClick={startEdit}>
                Редактировать
              </Button>
            )}
            <Button
              color="error"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => setConfirmDelete(true)}
            >
              Удалить
            </Button>
          </Stack>
        </Stack>
        {(updateError || deleteError) && (
          <Typography color="error">Не удалось сохранить или удалить проект.</Typography>
        )}
        {editing && draft ? (
          <ProjectEditForm value={draft} onChange={setDraft} />
        ) : (
          <ProjectReadView project={currentProject} />
        )}
      </Stack>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Удалить проект?</DialogTitle>
        <DialogContent>
          <Typography>
            Проект «{currentProject.title}» будет удалён без возможности восстановления.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}

function ProjectReadView({ project }: { project: Project }) {
  return (
    <Stack gap={2.5}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
          {project.title}
        </Typography>
        <Chip
          label={project.status === 'READY' ? 'Готов' : 'Черновик'}
          color={project.status === 'READY' ? 'success' : 'default'}
        />
      </Stack>
      <Typography color="text.secondary">
        {project.description || 'Описание пока не добавлено.'}
      </Typography>
      <InfoBlock title="Команда">
        <Typography>
          {project.team.map((item) => `${item.name} | ${item.count}`).join(' · ') || 'Не указана'}
        </Typography>
      </InfoBlock>
      <InfoBlock title="Стек">
        <Stack direction="row" gap={1} flexWrap="wrap">
          {project.technologies.map((item) => (
            <Chip key={item.id} label={item.name} color={item.isFeatured ? 'primary' : 'default'} />
          ))}
        </Stack>
      </InfoBlock>
      <InfoBlock title="Задачи">
        <BulletList items={project.tasks} />
      </InfoBlock>
      <InfoBlock title="Обязанности">
        <BulletList items={project.responsibilities} />
      </InfoBlock>
      <InfoBlock title="Достижения">
        <BulletList items={project.achievements} />
      </InfoBlock>
      <InfoBlock title="Вопросы">
        <ProjectQuestionsWidget questions={project.questions} />
      </InfoBlock>
    </Stack>
  );
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
      <ProjectTechnologyWidget
        value={(value.technologies ?? []) as Project['technologies']}
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

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassPanel sx={{ p: 2.5 }}>
      <Stack gap={1}>
        <Typography variant="h6">{title}</Typography>
        {children}
      </Stack>
    </GlassPanel>
  );
}

function BulletList({ items }: { items: string[] }) {
  return items.length ? (
    <Stack component="ul" sx={{ m: 0, pl: 2.5 }}>
      {items.map((item, index) => (
        <Typography component="li" key={index}>
          {item}
        </Typography>
      ))}
    </Stack>
  ) : (
    <Typography color="text.secondary">Пока не заполнено.</Typography>
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
    <InfoBlock title={label}>
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
    </InfoBlock>
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
    <InfoBlock title="Команда">
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
    </InfoBlock>
  );
}
