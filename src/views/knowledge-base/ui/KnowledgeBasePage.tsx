'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

import { useCreateCategoryMutation } from '@/entities/category';
import { AppShell } from '@/widgets/app-shell';

import type { Category } from '@/entities/category';

const defaultColor = '#1F8A8A';

export default function KnowledgeBasePage({
    initialCategories,
}: {
    initialCategories: Category[];
}) {
    const [categories, setCategories] = useState(initialCategories);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [name, setName] = useState('');
    const [accentColor, setAccentColor] = useState(defaultColor);
    const [createCategory, createState] = useCreateCategoryMutation();

    async function submit() {
        const category = await createCategory({ name, accentColor }).unwrap();

        setCategories((items) => [...items, category]);
        setDialogOpen(false);
        setName('');
    }

    return (
        <AppShell>
            <Stack gap={4}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Box>
                        <Typography variant="h3">База знаний</Typography>
                        <Typography color="text.secondary">
                            Категории, темы и вопросы для подготовки.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => setDialogOpen(true)}
                    >
                        Создать категорию
                    </Button>
                </Stack>
                {categories.length ? (
                    <Grid container spacing={2}>
                        {categories.map((category) => (
                            <Grid item xs={12} sm={6} md={4} key={category.id}>
                                <Button
                                    component={Link}
                                    href={`/knowledge-base/category/${category.id}`}
                                    variant="outlined"
                                    sx={{
                                        minHeight: 144,
                                        width: '100%',
                                        justifyContent: 'start',
                                        p: 3,
                                        textAlign: 'left',
                                    }}
                                >
                                    <Stack gap={1} alignItems="start">
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: category.accentColor,
                                            }}
                                        />
                                        <Typography variant="h6">{category.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Открыть категорию
                                        </Typography>
                                    </Stack>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography color="text.secondary">
                        Категорий пока нет. Создайте первую категорию.
                    </Typography>
                )}
            </Stack>
            <Dialog
                open={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Новая категория</DialogTitle>
                <DialogContent>
                    <Stack gap={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Название"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoFocus
                            required
                        />
                        <TextField
                            label="Цвет"
                            value={accentColor}
                            onChange={(event) => setAccentColor(event.target.value)}
                            helperText="Формат #RRGGBB"
                            required
                        />
                        {createState.error && (
                            <Typography color="error">Не удалось создать категорию.</Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
                    <Button
                        variant="contained"
                        onClick={submit}
                        disabled={!name.trim() || createState.isLoading}
                    >
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        </AppShell>
    );
}
