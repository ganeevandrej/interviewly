'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Topic } from '@/entities/topic';

export function TopicList({
    topics,
    busy,
    onEdit,
    onDelete,
}: {
    topics: Topic[];
    busy: boolean;
    onEdit: (topic: Topic) => void;
    onDelete: (topic: Topic) => void;
}) {
    return (
        <>
            {topics.map((topic) => (
                <Stack key={topic.id} gap={1} sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ overflowWrap: 'anywhere' }}>{topic.name}</Typography>
                    {topic.isDefault ? (
                        <Typography color="text.secondary">
                            Сюда попадают вопросы без выбранной темы.
                        </Typography>
                    ) : (
                        <Stack direction="row" gap={1}>
                            <Button disabled={busy} onClick={() => onEdit(topic)}>
                                Переименовать
                            </Button>
                            <Button disabled={busy} color="error" onClick={() => onDelete(topic)}>
                                Удалить тему
                            </Button>
                        </Stack>
                    )}
                </Stack>
            ))}
        </>
    );
}
