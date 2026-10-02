import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import {
    CategoryIdentity,
    useDeleteCategoryMutation,
    useLazyGetCategoryDeletionImpactQuery,
} from '@/entities/category';

import { RelatedTrainings } from './RelatedTrainings';

import type { CategoryDeletionImpact, CategorySummary } from '@/entities/category';

type CategoryDeleteFeatureProps = {
    category: CategorySummary;
    onDeleted: (categoryId: string) => void;
};

export function CategoryDeleteFeature({ category, onDeleted }: CategoryDeleteFeatureProps) {
    const [isOpen, setOpen] = useState(false);
    const [trainingCount, setTrainingCount] = useState<number>();
    const [linkedTrainings, setLinkedTrainings] = useState<CategoryDeletionImpact['trainings']>([]);
    const [hasCheckedDeletionImpact, setHasCheckedDeletionImpact] = useState(false);
    const [isDeletionImpactError, setDeletionImpactError] = useState(false);
    const [deleteCategory, deleteState] = useDeleteCategoryMutation();
    const [getDeletionImpact, deletionImpactState] = useLazyGetCategoryDeletionImpactQuery();

    function openDialog() {
        setOpen(true);
        setTrainingCount(undefined);
        setLinkedTrainings([]);
        setHasCheckedDeletionImpact(false);
        setDeletionImpactError(false);
    }

    async function checkDeletionImpact() {
        try {
            const impact = await getDeletionImpact(category.id).unwrap();

            setTrainingCount(impact.trainingCount);
            setLinkedTrainings(impact.trainings);
            setHasCheckedDeletionImpact(true);
        } catch {
            setDeletionImpactError(true);
        }
    }

    async function confirmDeletion() {
        if (trainingCount === undefined) return;

        try {
            await deleteCategory(category.id).unwrap();

            onDeleted(category.id);
            closeDialog();
        } catch {
            // Ошибка отображается через состояние RTK Query.
        }
    }

    function closeDialog() {
        if (deleteState.isLoading) return;

        setOpen(false);
    }

    return (
        <>
            <IconButton aria-label={`Удалить категорию ${category.name}`} onClick={openDialog}>
                <DeleteOutlineRoundedIcon />
            </IconButton>
            <Dialog
                open={isOpen}
                onClose={closeDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={dialogPaperProps}
            >
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
                <DialogTitle component="div">
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: { xs: 20, sm: 22 },
                            fontWeight: 600,
                            lineHeight: { xs: '29px', sm: '32px' },
                        }}
                    >
                        Удалить категорию?
                    </Typography>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack gap={2}>
                        <Typography>
                            Вместе с категорией будут удалены все её темы и вопросы. Данные
                            связанных тренировок могут измениться.
                        </Typography>
                        <CategoryIdentity category={category} />
                        {deletionImpactState.isFetching && (
                            <Typography color="text.secondary">
                                Проверяем связи с тренировками…
                            </Typography>
                        )}
                        {!deletionImpactState.isFetching &&
                            !isDeletionImpactError &&
                            !hasCheckedDeletionImpact && (
                                <Button
                                    startIcon={<LinkRoundedIcon />}
                                    onClick={checkDeletionImpact}
                                    sx={(theme) => ({
                                        width: '100%',
                                        minHeight: { xs: 44, sm: 42 },
                                        justifyContent: 'flex-start',
                                        borderRadius: '12px',
                                        backgroundColor: theme.interviewly.surfaces.primarySubtle,
                                        color: 'primary.main',
                                        fontSize: { xs: 14, sm: 14 },
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor:
                                                theme.interviewly.surfaces.primarySubtle,
                                        },
                                    })}
                                >
                                    Проверить связи
                                </Button>
                            )}
                        {isDeletionImpactError && (
                            <Stack
                                gap={1.5}
                                sx={(theme) => ({
                                    p: 1.75,
                                    border: 1,
                                    borderColor: 'error.main',
                                    borderRadius: '12px',
                                    backgroundColor: theme.palette.error.contrastText,
                                })}
                            >
                                <Stack direction="row" gap={1.25} alignItems="start">
                                    <ErrorOutlineRoundedIcon color="error" />
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: 13, sm: 14 },
                                                fontWeight: 600,
                                                lineHeight: '20px',
                                            }}
                                        >
                                            Не удалось проверить связи
                                        </Typography>
                                        <Typography
                                            sx={{ mt: 0.375, fontSize: 12, lineHeight: '17px' }}
                                            color="text.secondary"
                                        >
                                            Проверьте подключение и попробуйте ещё раз.
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={checkDeletionImpact}
                                    sx={(theme) => ({
                                        width: '100%',
                                        minHeight: 39,
                                        borderRadius: '10px',
                                        backgroundColor: theme.palette.error.contrastText,
                                        fontSize: 13,
                                        fontWeight: 600,
                                    })}
                                >
                                    Повторить
                                </Button>
                            </Stack>
                        )}
                        {hasCheckedDeletionImpact &&
                            (trainingCount ? (
                                <RelatedTrainings trainings={linkedTrainings} />
                            ) : (
                                <Stack
                                    direction="row"
                                    gap={{ xs: 1.25, sm: 1.5 }}
                                    alignItems="center"
                                    sx={{
                                        minHeight: 100,
                                        p: { xs: 1.75, sm: 2 },
                                        borderRadius: '12px',
                                        bgcolor: '#263725',
                                    }}
                                >
                                    <CheckCircleRoundedIcon color="success" sx={{ fontSize: 20 }} />
                                    <Typography
                                        sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 600 }}
                                        color="success.main"
                                    >
                                        Нет зависимых тренировок
                                    </Typography>
                                </Stack>
                            ))}
                        {deleteState.error && (
                            <Alert severity="error">Не удалось удалить категорию.</Alert>
                        )}
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={closeDialog}>Отмена</Button>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={confirmDeletion}
                        sx={(theme) => ({
                            minHeight: { xs: 44, sm: 42 },
                            px: { xs: 2, sm: 2.25 },
                            borderRadius: '12px',
                            backgroundColor: theme.palette.error.contrastText,
                            fontSize: 14,
                            fontWeight: 600,
                        })}
                        disabled={
                            deletionImpactState.isFetching ||
                            isDeletionImpactError ||
                            trainingCount === undefined ||
                            deleteState.isLoading
                        }
                    >
                        Удалить категорию
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const dialogPaperProps = {
    sx: {
        width: { sm: 620 },
        maxWidth: { xs: '100%', sm: 620 },
        m: { xs: 0, sm: 4 },
        border: 1,
        borderColor: 'divider',
        borderRadius: { xs: '20px 20px 0 0', sm: '20px' },
        backgroundColor: '#20282F',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.4)',
        alignSelf: { xs: 'end', sm: 'center' },
        '& .MuiDialogTitle-root': { px: { xs: 3, sm: 3.5 }, py: { xs: 2.5, sm: 2.25 } },
        '& .MuiDialogContent-root': { px: { xs: 3, sm: 3.5 }, py: { xs: 2.25, sm: 3 } },
        '& .MuiDialogActions-root': {
            minHeight: { xs: 80, sm: 78 },
            px: { xs: 3, sm: 3.5 },
            py: 2,
        },
    },
};
