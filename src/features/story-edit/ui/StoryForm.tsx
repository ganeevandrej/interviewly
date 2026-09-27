'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { GlassPanel } from '@/shared/ui/glass-panel';

import type { StoryInput } from '@/entities/story';

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

export function StoryForm({
    form,
    onChange,
    disabled,
}: {
    form: StoryInput;
    onChange: (name: keyof StoryInput, value: string) => void;
    disabled: boolean;
}) {
    return (
        <>
            <TextField
                label="Название"
                value={form.title}
                onChange={(event) => onChange('title', event.target.value)}
                required
                fullWidth
                disabled={disabled}
            />
            {fields.map((field) => (
                <TextField
                    key={field.name}
                    label={field.label}
                    value={form[field.name] ?? ''}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                    disabled={disabled}
                />
            ))}
            <GlassPanel sx={{ p: 3 }}>
                <Stack gap={2}>
                    <Typography variant="h6">Дополнительные вопросы</Typography>
                    <TextField
                        label="Вопросы или темы, которые стоит разобрать"
                        value={form.additionalQuestions ?? ''}
                        onChange={(event) => onChange('additionalQuestions', event.target.value)}
                        multiline
                        minRows={4}
                        fullWidth
                        disabled={disabled}
                    />
                    <Button variant="outlined" disabled>
                        Создать вопрос — скоро будет доступно
                    </Button>
                </Stack>
            </GlassPanel>
        </>
    );
}
