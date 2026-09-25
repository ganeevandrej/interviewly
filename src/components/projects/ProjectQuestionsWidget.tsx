'use client';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ProjectQuestion } from '@/types';

export function ProjectQuestionsWidget({ questions }: { questions: ProjectQuestion[] }) {
  return (
    <Stack gap={2}>
      <TextField
        label="Поиск вопросов"
        placeholder="Виджет будет подключён позже"
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
      {!questions.length && (
        <Typography color="text.secondary">Вопросы пока не подключены.</Typography>
      )}
      {questions.map((question) => (
        <Typography key={question.id}>{question.question}</Typography>
      ))}
    </Stack>
  );
}
