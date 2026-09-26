'use client';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useUpdateTopicMutation,
} from '@/services/libraryApi';

import type { Topic } from '@/types';

export function TopicManager({ onClose, groupId, topics: groupTopics }: { onClose: () => void; groupId: string; topics: Topic[] }) {
  const [createTopic, createState] = useCreateTopicMutation();
  const [updateTopic, updateState] = useUpdateTopicMutation();
  const [deleteTopic, deleteState] = useDeleteTopicMutation();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState<Topic | null>(null);

  const topics = groupTopics.filter((topic) => topic.groupId === groupId);
  const busy = createState.isLoading || updateState.isLoading || deleteState.isLoading;

  async function save() {
    if (!name.trim()) return;

    const saved = await (editing
      ? updateTopic({ groupId, topicId: editing.id, name: name.trim() })
      : createTopic({ groupId, name: name.trim() })).unwrap().then(() => true).catch(() => false);

    if (saved) {
      setName('');
      setEditing(null);
    }
  }

  async function remove() {
    if (!deleting) return;
    const removed = await deleteTopic({ groupId, topicId: deleting.id }).unwrap().then(() => true).catch(() => false);

    if (removed) {
      if (editing?.id === deleting.id) {
        setEditing(null);
        setName('');
      }
      setDeleting(null);
    }
  }

  return (
    <>
      <Dialog
        open
        onClose={busy ? undefined : onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="topics-title"
      >
        <DialogTitle id="topics-title">Темы группы</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ pt: 1 }}>
            <TextField
              label={editing ? 'Новое название темы' : 'Название новой темы'}
              value={name}
              disabled={busy}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void save();
                }
              }}
            />
            <Stack direction="row" gap={1}>
              <Button
                variant="contained"
                disabled={busy || !name.trim()}
                onClick={() => void save()}
              >
                {busy ? 'Сохранение…' : editing ? 'Сохранить название' : 'Создать тему'}
              </Button>
              {editing && (
                <Button
                  disabled={busy}
                  onClick={() => {
                    setEditing(null);
                    setName('');
                  }}
                >
                  Отмена
                </Button>
              )}
            </Stack>
            {topics.map((topic) => (
              <Stack
                key={topic.id}
                gap={1}
                sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider' }}
              >
                <Typography sx={{ overflowWrap: 'anywhere' }}>{topic.name}</Typography>
                {topic.isDefault ? (
                  <Typography color="text.secondary">
                    Сюда попадают вопросы без выбранной темы.
                  </Typography>
                ) : (
                  <Stack direction="row" gap={1}>
                    <Button
                      disabled={busy}
                      onClick={() => {
                        setEditing(topic);
                        setName(topic.name);
                      }}
                    >
                      Переименовать
                    </Button>
                    <Button
                      disabled={busy}
                      color="error"
                      onClick={() => {
                        setDeleting(topic);
                      }}
                    >
                      Удалить тему
                    </Button>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={onClose}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(deleting)}
        onClose={busy ? undefined : () => setDeleting(null)}
        aria-labelledby="delete-topic-title"
      >
        <DialogTitle id="delete-topic-title">Удалить тему «{deleting?.name}»?</DialogTitle>
        <DialogContent>
          <Typography>Вопросы останутся в этой группе в теме «Без темы».</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={busy}
            onClick={() => {
              setDeleting(null);
            }}
          >
            Отмена
          </Button>
          <Button disabled={busy} color="error" onClick={() => void remove()}>
            {busy ? 'Удаление…' : 'Подтвердить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
