'use client';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { QuestionGroup } from '@/types';
import { GlassPanel } from './GlassPanel';

type GroupCardProps = {
  group: QuestionGroup;
  count: number;
};

export function GroupCard({ group, count }: GroupCardProps) {
  return (
    <GlassPanel
      component={Link}
      href={`/groups/${group.id}`}
      sx={{
        display: 'block',
        p: 3,
        borderColor: `${group.accentColor}66`,
        boxShadow: `0 18px 50px ${group.accentColor}22`,
        transition: 'transform .22s ease, border-color .22s ease, box-shadow .22s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: `${group.accentColor}cc`,
          boxShadow: `0 22px 70px ${group.accentColor}33`
        }
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            display: 'grid',
            placeItems: 'center',
            color: '#050816',
            fontWeight: 900,
            background: group.accentColor,
            boxShadow: `0 0 34px ${group.accentColor}77`
          }}
        >
          {group.name.slice(0, 2).toUpperCase()}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" noWrap>
            {group.name}
          </Typography>
          <Typography color="text.secondary">
            {count} {count === 1 ? 'вопрос' : 'вопросов'}
          </Typography>
        </Box>
        <IconButton aria-label={`Открыть ${group.name}`}>
          <ArrowForwardRoundedIcon />
        </IconButton>
      </Stack>
    </GlassPanel>
  );
}
