'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { FormEvent } from 'react';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import { storiesApi } from '@/client/stories';

import type { StoryInput } from '@/types';

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
  | 'context'
  | 'problem'
  | 'responsibility'
  | 'solution'
  | 'difficulties'
  | 'learned';

const fields: Array<{ name: StoryTextFieldName; label: string }> = [
  { name: 'context', label: 'Контекст' },
  { name: 'problem', label: 'Проблема' },
  { name: 'responsibility', label: 'Моя ответственность' },
  { name: 'solution', label: 'Решение' },
  { name: 'difficulties', label: 'Сложности' },
  { name: 'learned', label: 'Полученные знания' },
];

type StoryTextFieldProps = {
  name: StoryTextFieldName;
  label: string;
  value: string;
  onChange: (name: StoryTextFieldName, value: string) => void;
};

function StoryTextField({ name, label, value, onChange }: StoryTextFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      multiline
      minRows={4}
      fullWidth
    />
  );
}

export default function StoryFormPage() {
  const params = useParams<{ storyId: string }>();
  const router = useRouter();
  const isNew = params.storyId === 'new';
  const [form, setForm] = useState<StoryInput>(emptyStory);
  const [pending, setPending] = useState(!isNew);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;

    let active = true;

    storiesApi
      .read(params.storyId)
      .then((story) => {
        if (!active) return;

        setForm({
          ...story,
          tags: story.tags.map((tag) => tag.name),
          questionIds: story.questions.map((question) => question.id),
        });
        setPending(false);
      })
      .catch((reason: Error) => {
        if (!active) return;

        setError(reason.message);
        setPending(false);
      });

    return () => {
      active = false;
    };
  }, [isNew, params.storyId]);

  function update(name: keyof StoryInput, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const story = isNew
        ? await storiesApi.create(form)
        : await storiesApi.update(params.storyId, form);
      router.push(`/stories/${story.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось сохранить историю.');
      setPending(false);
    }
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
        <Stack gap={1}>
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
            {isNew ? 'Новая история' : 'Редактирование истории'}
          </Typography>
          <Typography color="text.secondary">
            Заполните основные блоки опыта обычным текстом.
          </Typography>
        </Stack>
        {error && <Typography color="error">{error}</Typography>}
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
              <StoryTextField
                key={field.name}
                name={field.name}
                label={field.label}
                value={form[field.name] ?? ''}
                onChange={update}
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
