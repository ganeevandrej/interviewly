'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { useCreateStoryMutation, useUpdateStoryMutation } from '@/entities/story';
import type { Story, StoryInput } from '@/entities/story';

import { StoryForm } from './StoryForm';

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

export function StoryEditor({
    initialStory,
    storyId = 'new',
}: {
    initialStory?: Story;
    storyId?: string;
}) {
    const router = useRouter();
    const isNew = storyId === 'new';
    const [form, setForm] = useState<StoryInput>(() =>
        initialStory
            ? {
                  ...initialStory,
                  tags: initialStory.tags.map((tag) => tag.name),
                  questionIds: initialStory.questions.map((question) => question.id),
              }
            : emptyStory,
    );
    const [createStory, createState] = useCreateStoryMutation();
    const [updateStory, updateState] = useUpdateStoryMutation();
    const pending = createState.isLoading || updateState.isLoading;
    const error = createState.error ?? updateState.error;
    const errorMessage =
        error && 'data' in error && typeof error.data === 'string' ? error.data : '';

    function update(name: keyof StoryInput, value: string) {
        setForm((current) => ({ ...current, [name]: value }));
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        const result = isNew
            ? await createStory(form)
            : await updateStory({ storyId, body: form });

        if ('data' in result && result.data) router.push(`/stories/${result.data.id}`);
    }

    return (
        <Stack component="form" onSubmit={submit} gap={3} sx={{ maxWidth: 820, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                <Button
                    disabled={pending}
                    component={Link}
                    href="/stories"
                    startIcon={<ArrowBackRoundedIcon />}
                >
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
                <StoryForm form={form} onChange={update} disabled={pending} />
            )}
        </Stack>
    );
}
