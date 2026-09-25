'use client';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { GlassPanel } from '@/components/GlassPanel';
import type { ProjectListItem } from '@/types';

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <GlassPanel component={Link} href={`/projects/${project.id}`} sx={{ p: 2.5 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
        <Stack gap={1.5} minWidth={0}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: project.color }} />
            <Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>
              {project.title}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {project.technologies
              .filter((item) => item.isFeatured)
              .map((technology) => (
                <Chip key={technology.id} label={technology.name} size="small" />
              ))}
          </Stack>
        </Stack>
        <IconButton aria-label={`Открыть проект «${project.title}»`}>
          <ArrowForwardRoundedIcon />
        </IconButton>
      </Stack>
    </GlassPanel>
  );
}
