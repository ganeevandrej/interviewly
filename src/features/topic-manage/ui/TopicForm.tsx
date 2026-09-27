'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { Topic } from '@/entities/topic';

export function TopicForm({
    editing,
    name,
    busy,
    onNameChange,
    onSave,
    onCancel,
}: {
    editing: Topic | null;
    name: string;
    busy: boolean;
    onNameChange: (name: string) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    return (
        <>
            <TextField
                label={editing ? 'Новое название темы' : 'Название новой темы'}
                value={name}
                disabled={busy}
                onChange={(event) => onNameChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        onSave();
                    }
                }}
            />
            <Stack direction="row" gap={1}>
                <Button variant="contained" disabled={busy || !name.trim()} onClick={onSave}>
                    {busy ? 'Сохранение…' : editing ? 'Сохранить название' : 'Создать тему'}
                </Button>
                {editing && (
                    <Button disabled={busy} onClick={onCancel}>
                        Отмена
                    </Button>
                )}
            </Stack>
        </>
    );
}
