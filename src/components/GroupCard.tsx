'use client';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { QuestionGroup } from '@/types';
import { GlassPanel } from './GlassPanel';

type GroupCardProps = {
  group: QuestionGroup;
  count: number;
};

export function GroupCard({ group, count }: GroupCardProps) {
  const questionLabel = count === 1 ? 'вопрос' : 'вопросов';
  const initials = group.name.slice(0, 2).toUpperCase();

  return (
    <GlassPanel
      component={Link}
      href={`/groups/${group.id}`}
      sx={{
        display: 'block',
        p: 3,
        borderColor: 'divider',
        transition:
          'transform 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), background-color 180ms cubic-bezier(0.2, 0, 0, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'primary.main',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            color: 'background.default',
            fontWeight: 900,
            background: group.accentColor,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {initials}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" noWrap>
            {group.name}
          </Typography>
          <Typography color="text.secondary">
            {count} {questionLabel}
          </Typography>
        </Box>
        <ArrowForwardRoundedIcon color="primary" aria-hidden="true" />
      </Stack>
    </GlassPanel>
  );
}
