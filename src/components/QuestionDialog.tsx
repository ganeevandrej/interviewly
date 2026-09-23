'use client';

import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import { useAsyncAction } from '@/client/useAsyncAction';

import type { Topic, Question, QuestionInput } from '@/types';

type QuestionDialogProps = {
  open: boolean;
  question?: Question;
  topics: Topic[];
  initialTopicId?: string | null;
  onClose: () => void;
  onSave: (payload: QuestionInput) => Promise<void>;
};

export function QuestionDialog(props: QuestionDialogProps) {
  return props.open ? <QuestionDialogForm key={props.question?.id ?? 'new'} {...props} /> : null;
}

function QuestionDialogForm({
  open,
  question,
  topics,
  initialTopicId,
  onClose,
  onSave,
}: QuestionDialogProps) {
  const [questionText, setQuestionText] = useState(question?.question ?? '');
  const [topicId, setTopicId] = useState(question ? question.topicId : (initialTopicId ?? null));
  const [answer, setAnswer] = useState(question?.answer ?? '');

  const selectedTopicId = topics.some((topic) => topic.id === topicId && !topic.isDefault)
    ? topicId
    : null;
  const availableTopics = topics.filter((topic) => !topic.isDefault);

  const action = useAsyncAction();

  const handleSave = async () => {
    if (!questionText.trim() || !answer.trim()) return;

    const saved = await action.run(() =>
      onSave({
        question: questionText.trim(),
        answer: answer.trim(),
        topicId: selectedTopicId,
      }),
    );

    if (saved) onClose();
  };

  return (
    <Dialog open={open} onClose={action.busy ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{question ? 'Редактировать вопрос' : 'Новый вопрос'}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          {action.error && <Alert severity="error">{action.error}</Alert>}
          <TextField
            disabled={action.busy}
            select
            label="Тема"
            value={selectedTopicId ?? ''}
            onChange={(event) => setTopicId(event.target.value || null)}
          >
            <MenuItem value="">Без темы</MenuItem>
            {availableTopics.map((topic) => (
              <MenuItem key={topic.id} value={topic.id}>
                {topic.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            disabled={action.busy}
            label="Вопрос"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            multiline
            minRows={3}
            autoFocus
          />
          <TextField
            disabled={action.busy}
            label="Ответ"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            multiline
            minRows={5}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={action.busy} onClick={onClose}>
          Отмена
        </Button>
        <Button
          disabled={action.busy || !questionText.trim() || !answer.trim()}
          onClick={handleSave}
          variant="contained"
        >
          {action.busy ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
