'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useInterviewlyStore } from '@/store/useInterviewlyStore';
import { Category } from '@/types';

export function CategoryManager({
  open,
  onClose,
  groupId,
}: {
  open: boolean;
  onClose: () => void;
  groupId?: string;
}) {
  const store = useInterviewlyStore();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [pending, setPending] = useState<{
    category: Category;
    action: 'remove' | 'delete';
  } | null>(null);
  const linkedIds = new Set(
    store.groupCategories.filter((link) => link.groupId === groupId).map((link) => link.categoryId),
  );

  const save = () => {
    if (!name.trim()) return;
    if (editing) store.renameCategory(editing.id, name);
    else store.createCategory(name, groupId);
    setName('');
    setEditing(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="categories-title"
      >
        <DialogTitle id="categories-title">
          {groupId ? 'Категории группы' : 'Все категории'}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Категории общие для всех групп. Переименование будет видно везде.
            </Typography>
            <TextField
              label={editing ? 'Новое название категории' : 'Название новой категории'}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  save();
                }
              }}
            />
            <Stack direction="row" gap={1}>
              <Button variant="contained" disabled={!name.trim() || !store.hydrated} onClick={save}>
                {editing
                  ? 'Сохранить название'
                  : groupId
                    ? 'Создать и добавить в группу'
                    : 'Создать категорию'}
              </Button>
              {editing && (
                <Button
                  onClick={() => {
                    setEditing(null);
                    setName('');
                  }}
                >
                  Отмена
                </Button>
              )}
            </Stack>
            {!store.categories.length && (
              <Typography color="text.secondary">Категорий пока нет.</Typography>
            )}
            {store.categories.map((category) => (
              <Stack
                key={category.id}
                gap={1}
                sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider' }}
              >
                <Typography sx={{ overflowWrap: 'anywhere' }}>{category.name}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {groupId &&
                    (linkedIds.has(category.id) ? (
                      <Button onClick={() => setPending({ category, action: 'remove' })}>
                        Убрать из группы
                      </Button>
                    ) : (
                      <Button onClick={() => store.addCategoryToGroup(groupId, category.id)}>
                        Добавить в группу
                      </Button>
                    ))}
                  <Button
                    onClick={() => {
                      setEditing(category);
                      setName(category.name);
                    }}
                  >
                    Переименовать
                  </Button>
                  <Button color="error" onClick={() => setPending({ category, action: 'delete' })}>
                    Удалить категорию
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        aria-labelledby="category-action-title"
      >
        <DialogTitle id="category-action-title">
          {pending?.action === 'remove' ? 'Убрать из группы' : 'Удалить категорию'} «
          {pending?.category.name}»?
        </DialogTitle>
        <DialogContent>
          <Typography>
            {pending?.action === 'remove'
              ? 'Вопросы останутся в этой группе без категории. Другие группы и сама категория сохранятся.'
              : 'Категория будет удалена из всех групп. Все вопросы останутся в своих группах без этой категории.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPending(null)}>Отмена</Button>
          <Button
            color="error"
            onClick={() => {
              if (!pending) return;
              if (pending.action === 'remove' && groupId)
                store.removeCategoryFromGroup(groupId, pending.category.id);
              else store.deleteCategory(pending.category.id);
              if (editing?.id === pending.category.id) {
                setEditing(null);
                setName('');
              }
              setPending(null);
            }}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
