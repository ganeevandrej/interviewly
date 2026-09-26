'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useGetProjectsQuery } from '@/services/projects';

import { AppShell } from '@/components/AppShell';
import { ProjectCard } from '@/components/ProjectCard';
import type { ProjectListItem } from '@/types';

export default function ProjectsPage() {
  const { data: projects = [], error } = useGetProjectsQuery();

  const ready = projects.filter((project) => project.status === 'READY');
  const drafts = projects.filter((project) => project.status === 'DRAFT');

  return (
    <AppShell>
      <Stack gap={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
            Проекты
          </Typography>
          <Button
            component={Link}
            href="/projects/new"
            variant="contained"
            startIcon={<AddRoundedIcon />}
          >
            Новый проект
          </Button>
        </Stack>
        {error && <Typography color="error">Не удалось загрузить проекты.</Typography>}
        {!projects.length && !error && (
          <Typography color="text.secondary">Проектов пока нет.</Typography>
        )}
        {ready.length > 0 && <ProjectSection title="Готовые проекты" projects={ready} />}
        {drafts.length > 0 && <ProjectSection title="Черновики" projects={drafts} />}
      </Stack>
    </AppShell>
  );
}

function ProjectSection({ title, projects }: { title: string; projects: ProjectListItem[] }) {
  return (
    <Stack gap={1.5}>
      <Typography variant="h5">{title}</Typography>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Stack>
  );
}
