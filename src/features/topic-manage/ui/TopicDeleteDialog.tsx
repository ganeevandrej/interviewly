'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import type { Topic } from '@/entities/topic';

export function TopicDeleteDialog({
    topic,
    busy,
    onClose,
    onConfirm,
}: {
    topic: Topic | null;
    busy: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog
            open={Boolean(topic)}
            onClose={busy ? undefined : onClose}
            aria-labelledby="delete-topic-title"
        >
            <DialogTitle id="delete-topic-title">Удалить тему «{topic?.name}»?</DialogTitle>
            <DialogContent>
                <Typography>Вопросы останутся в этой группе в теме «Без темы».</Typography>
            </DialogContent>
            <DialogActions>
                <Button disabled={busy} onClick={onClose}>
                    Отмена
                </Button>
                <Button disabled={busy} color="error" onClick={onConfirm}>
                    {busy ? 'Удаление…' : 'Подтвердить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
