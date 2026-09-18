'use client';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { Question } from '@/types';

export function QuestionList({
  questions,
  onQuestionMenu,
}: {
  questions: Question[];
  onQuestionMenu: (event: MouseEvent<HTMLElement>, question: Question) => void;
}) {
  return (
    <Stack gap={1.5}>
      {questions.map((question, index) => (
        <GlassPanel
          key={question.id}
          sx={{
            p: 2,
            transition: 'transform .2s ease',
            '&:hover': { transform: 'translateX(3px)' },
          }}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              component={Link}
              href={'/groups/' + question.groupId + '/focus/' + question.id}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}
            >
              <Typography color="text.secondary" sx={{ width: 34 }}>
                {(index + 1).toString().padStart(2, '0')}
              </Typography>
              <Typography sx={{ flex: 1, overflowWrap: 'anywhere' }}>
                {question.question}
              </Typography>
            </Box>
            <IconButton
              aria-label={'Действия: ' + question.question}
              onClick={(event) => onQuestionMenu(event, question)}
            >
              <MoreHorizRoundedIcon />
            </IconButton>
          </Stack>
        </GlassPanel>
      ))}
    </Stack>
  );
}
