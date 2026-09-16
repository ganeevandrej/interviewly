'use client';

import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { QuestionGroup } from '@/types';

const colors = ['#6d7cff', '#22d3ee', '#8b5cf6', '#f472b6', '#34d399', '#facc15'];

type GroupDialogProps = {
  open: boolean;
  group?: QuestionGroup;
  onClose: () => void;
  onSave: (payload: Omit<QuestionGroup, 'id'>) => void;
};

export function GroupDialog(props: GroupDialogProps) {
  return props.open ? <GroupDialogForm key={props.group?.id ?? 'new'} {...props} /> : null;
}

function GroupDialogForm({ open, group, onClose, onSave }: GroupDialogProps) {
  const [name, setName] = useState(group?.name ?? '');
  const [accentColor, setAccentColor] = useState(group?.accentColor ?? colors[0]);

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
          <TextField
            label="Название"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
          />
          <Stack direction="row" gap={1}>
            {colors.map((color) => (
              <ButtonBase
                type="button"
                key={color}
                aria-label={`Цвет ${color}`}
                aria-pressed={color === accentColor}
                onClick={() => setAccentColor(color)}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  border: color === accentColor ? '2px solid' : '1px solid',
                  borderColor: color === accentColor ? 'common.white' : 'divider',
                  '&.Mui-focusVisible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 3,
                  },
                  background: color,
                  cursor: 'pointer',
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
