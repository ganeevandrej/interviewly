import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { useCreateCategoryMutation } from '@/entities/category';

import type { Category } from '@/entities/category';

const defaultColor = '#1F8A8A';
const categoryColors = [
    { name: 'мятный', value: '#1F8A8A' },
    { name: 'лавандовый', value: '#8B7CC8' },
    { name: 'голубой', value: '#4C8ED9' },
    { name: 'зелёный', value: '#6FA05B' },
    { name: 'янтарный', value: '#C58A2E' },
    { name: 'розовый', value: '#C65C70' },
];

type CategoryCreateDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreated: (category: Category) => void;
};

export function CategoryCreateDialog({ open, onClose, onCreated }: CategoryCreateDialogProps) {
    const [name, setName] = useState('');
    const [accentColor, setAccentColor] = useState(defaultColor);
    const [createCategory, createState] = useCreateCategoryMutation();

    async function submit() {
        try {
            const category = await createCategory({ name, accentColor }).unwrap();

            onCreated(category);
            setName('');
            onClose();
        } catch {
            // Ошибка отображается через состояние RTK Query.
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={dialogPaperProps}>
            <Box sx={{ display: { sm: 'none' }, px: 2.5, pt: 1.25 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 4,
                        mx: 'auto',
                        borderRadius: 999,
                        backgroundColor: 'divider',
                    }}
                />
            </Box>
            <DialogTitle>
                <Typography variant="h4">Создать категорию</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Добавьте название и выберите цветовой акцент.
                </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Stack gap={2.25}>
                    <TextField
                        label="Название категории"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoFocus
                        required
                        multiline
                        minRows={2}
                    />
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Цвет категории
                        </Typography>
                        <Stack direction="row" gap={1.5} flexWrap="wrap">
                            {categoryColors.map((color) => (
                                <IconButton
                                    key={color.value}
                                    aria-label={`Выбрать ${color.name} цвет`}
                                    aria-pressed={accentColor === color.value}
                                    onClick={() => setAccentColor(color.value)}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        border: accentColor === color.value ? 2 : 1,
                                        borderColor:
                                            accentColor === color.value
                                                ? 'text.primary'
                                                : 'divider',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            backgroundColor: color.value,
                                        }}
                                    />
                                </IconButton>
                            ))}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Выбран:{' '}
                            {categoryColors.find((color) => color.value === accentColor)?.name}
                        </Typography>
                    </Box>
                    {createState.error && (
                        <Typography color="error">Не удалось создать категорию.</Typography>
                    )}
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={!name.trim() || createState.isLoading}
                >
                    Создать
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const dialogPaperProps = {
    sx: {
        width: { sm: 620 },
        maxWidth: { xs: '100%', sm: 620 },
        m: { xs: 0, sm: 4 },
        borderRadius: { xs: '24px 24px 0 0', sm: 3 },
        alignSelf: { xs: 'end', sm: 'center' },
        '& .MuiDialogTitle-root': { px: { xs: 3, sm: 3.5 }, py: { xs: 2.5, sm: 3 } },
        '& .MuiDialogContent-root': { px: { xs: 3, sm: 3.5 }, py: { xs: 3, sm: 3 } },
        '& .MuiDialogActions-root': { minHeight: 78, px: { xs: 3, sm: 3.5 }, py: 2 },
    },
};
