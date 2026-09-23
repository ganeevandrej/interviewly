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
import { useInterviewlyStore } from '@/store/useInterviewlyStore';
import { useAsyncAction } from '@/client/useAsyncAction';
import { Topic } from '@/types';

export function TopicManager({ onClose, groupId }: { onClose: () => void; groupId: string }) {
  const store = useInterviewlyStore();
  const action = useAsyncAction();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState<Topic | null>(null);
  const topics = store.topics.filter((topic) => topic.groupId === groupId);
  const busy = action.busy || store.pending;
  async function save() {
    if (!name.trim()) return;
    const saved = await action.run(() =>
      editing
        ? store.renameTopic(groupId, editing.id, name.trim())
        : store.createTopic(groupId, name.trim()),
    );
    if (saved) {
      setName('');
      setEditing(null);
    }
  }
  async function remove() {
    if (!deleting) return;
    const removed = await action.run(() => store.deleteTopic(groupId, deleting.id));
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
            {action.error && !deleting && <Alert severity="error">{action.error}</Alert>}
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
                {action.busy ? 'Сохранение…' : editing ? 'Сохранить название' : 'Создать тему'}
              </Button>
              {editing && (
                <Button
                  disabled={busy}
                  onClick={() => {
                    setEditing(null);
                    setName('');
                    action.clearError();
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
                        action.clearError();
                      }}
                    >
                      Переименовать
                    </Button>
                    <Button
                      disabled={busy}
                      color="error"
                      onClick={() => {
                        setDeleting(topic);
                        action.clearError();
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
          {action.error && <Alert severity="error">{action.error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={busy}
            onClick={() => {
              setDeleting(null);
              action.clearError();
            }}
          >
            Отмена
          </Button>
          <Button disabled={busy} color="error" onClick={() => void remove()}>
            {action.busy ? 'Удаление…' : 'Подтвердить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
