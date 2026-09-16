'use client';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { QuestionGroup } from '@/types';

const colors = ['#6d7cff', '#22d3ee', '#8b5cf6', '#f472b6', '#34d399', '#facc15'];

type GroupDialogProps = {
  open: boolean;
  group?: QuestionGroup;
  onClose: () => void;
  onSave: (payload: Omit<QuestionGroup, 'id'>) => void;
};

export function GroupDialog({ open, group, onClose, onSave }: GroupDialogProps) {
  const [name, setName] = useState('');
  const [accentColor, setAccentColor] = useState(colors[0]);

  useEffect(() => {
    setName(group?.name ?? '');
    setAccentColor(group?.accentColor ?? colors[0]);
  }, [group, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), accentColor });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{group ? 'Редактировать группу' : 'Новая группа'}</DialogTitle>
      <DialogContent>
        <Stack gap={3} sx={{ pt: 1 }}>
          <TextField label="Название" value={name} onChange={(event) => setName(event.target.value)} autoFocus />
          <Stack direction="row" gap={1}>
            {colors.map((color) => (
              <Box
                component="button"
                key={color}
                aria-label={`Цвет ${color}`}
                onClick={() => setAccentColor(color)}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  border: color === accentColor ? '2px solid #fff' : '1px solid rgba(255,255,255,.2)',
                  background: color,
                  cursor: 'pointer'
                }}
              />
            ))}
          </Stack>
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
