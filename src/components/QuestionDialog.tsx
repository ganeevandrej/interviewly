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
import { Category, Question } from '@/types';

type QuestionDialogProps = {
  open: boolean;
  question?: Question;
  categories: Category[];
  initialCategoryId?: string | null;
  onClose: () => void;
  onSave: (payload: Pick<Question, 'question' | 'answer' | 'categoryId'>) => void;
};

export function QuestionDialog(props: QuestionDialogProps) {
  return props.open ? <QuestionDialogForm key={props.question?.id ?? 'new'} {...props} /> : null;
}

function QuestionDialogForm({
  open,
  question,
  categories,
  initialCategoryId,
  onClose,
  onSave,
}: QuestionDialogProps) {
  const [questionText, setQuestionText] = useState(question?.question ?? '');
  const [categoryId, setCategoryId] = useState(
    question ? question.categoryId : (initialCategoryId ?? null),
  );
  const selectedCategoryId = categories.some((c) => c.id === categoryId) ? categoryId : null;
  const [answer, setAnswer] = useState(question?.answer ?? '');

  const handleSave = () => {
    if (!questionText.trim() || !answer.trim()) return;
    onSave({
      question: questionText.trim(),
      answer: answer.trim(),
      categoryId: selectedCategoryId,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{question ? 'Редактировать вопрос' : 'Новый вопрос'}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          <TextField
            select
            label="Категория"
            value={selectedCategoryId ?? ''}
            onChange={(event) => setCategoryId(event.target.value || null)}
          >
            <MenuItem value="">Без категории — на уровне группы</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Вопрос"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            multiline
            minRows={3}
            autoFocus
          />
          <TextField
            label="Ответ"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            multiline
            minRows={5}
          />
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
