'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Question } from '@/types';

type QuestionDialogProps = {
  open: boolean;
  question?: Question;
  onClose: () => void;
  onSave: (payload: Pick<Question, 'question' | 'answer'>) => void;
};

export function QuestionDialog({ open, question, onClose, onSave }: QuestionDialogProps) {
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setQuestionText(question?.question ?? '');
    setAnswer(question?.answer ?? '');
  }, [question, open]);

  const handleSave = () => {
    if (!questionText.trim() || !answer.trim()) return;
    onSave({ question: questionText.trim(), answer: answer.trim() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{question ? 'Редактировать вопрос' : 'Новый вопрос'}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          <TextField
            label="Вопрос"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            multiline
            minRows={3}
            autoFocus
          />
          <TextField label="Ответ" value={answer} onChange={(event) => setAnswer(event.target.value)} multiline minRows={5} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
