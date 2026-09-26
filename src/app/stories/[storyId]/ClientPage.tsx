'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import {
  useCreateStoryMutation,
  useUpdateStoryMutation,
} from '@/services/storiesApi';
import type { Story, StoryInput } from '@/types';

const emptyStory: StoryInput = {
  title: '',
  context: '',
  problem: '',
  responsibility: '',
  solution: '',
  difficulties: '',
  learned: '',
  additionalQuestions: '',
  tags: [],
  questionIds: [],
};
type StoryTextFieldName =
  'context' | 'problem' | 'responsibility' | 'solution' | 'difficulties' | 'learned';
const fields: Array<{ name: StoryTextFieldName; label: string }> = [
  { name: 'context', label: 'Контекст' },
  { name: 'problem', label: 'Проблема' },
  { name: 'responsibility', label: 'Моя ответственность' },
  { name: 'solution', label: 'Решение' },
  { name: 'difficulties', label: 'Сложности' },
  { name: 'learned', label: 'Полученные знания' },
];

export default function StoryFormPage({ initialStory }: { initialStory?: Story }) {
  const params = useParams<{ storyId: string }>();
  const router = useRouter();
  const isNew = params.storyId === 'new';
  const [form, setForm] = useState<StoryInput>(() =>
    initialStory
      ? { ...initialStory, tags: initialStory.tags.map((tag) => tag.name), questionIds: initialStory.questions.map((question) => question.id) }
      : emptyStory,
  );
  const [createStory, createState] = useCreateStoryMutation();
  const [updateStory, updateState] = useUpdateStoryMutation();
  const pending = createState.isLoading || updateState.isLoading;
  const error = createState.error ?? updateState.error;
  const errorMessage = error && 'data' in error && typeof error.data === 'string' ? error.data : '';

  function update(name: keyof StoryInput, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = isNew
      ? await createStory(form)
      : await updateStory({ storyId: params.storyId, body: form });
    if ('data' in result && result.data) router.push(`/stories/${result.data.id}`);
  }

  return (
    <AppShell>
      <Stack component="form" onSubmit={submit} gap={3} sx={{ maxWidth: 820, mx: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Button component={Link} href="/stories" startIcon={<ArrowBackRoundedIcon />}>
            Истории
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={pending || !form.title.trim()}
          >
            Сохранить
          </Button>
        </Stack>
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
          {isNew ? 'Новая история' : 'Редактирование истории'}
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {pending && !isNew ? (
          <Typography color="text.secondary">Загрузка истории…</Typography>
        ) : (
          <>
            <TextField
              label="Название"
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              required
              fullWidth
            />
            {fields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                value={form[field.name] ?? ''}
                onChange={(event) => update(field.name, event.target.value)}
                multiline
                minRows={4}
                fullWidth
              />
            ))}
            <GlassPanel sx={{ p: 3 }}>
              <Stack gap={2}>
                <Typography variant="h6">Дополнительные вопросы</Typography>
                <TextField
                  label="Вопросы или темы, которые стоит разобрать"
                  value={form.additionalQuestions ?? ''}
                  onChange={(event) => update('additionalQuestions', event.target.value)}
                  multiline
                  minRows={4}
                  fullWidth
                />
                <Button variant="outlined" disabled>
                  Создать вопрос — скоро будет доступно
                </Button>
              </Stack>
            </GlassPanel>
          </>
        )}
      </Stack>
    </AppShell>
  );
}
