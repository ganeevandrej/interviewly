import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { CategoryDeletionImpact } from '@/entities/category';

type RelatedTrainingsProps = {
    trainings: CategoryDeletionImpact['trainings'];
};

export function RelatedTrainings({ trainings }: RelatedTrainingsProps) {
    return (
        <Stack gap={{ xs: 0.875, sm: 1 }}>
            <Stack direction="row" gap={1} alignItems="center">
                <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 600 }}>
                    Связанные тренировки
                </Typography>
                <Box
                    sx={(theme) => ({
                        minWidth: 22,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 99,
                        backgroundColor: theme.interviewly.surfaces.infoSubtle,
                        color: 'info.main',
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: '17px',
                        textAlign: 'center',
                    })}
                >
                    {trainings.length}
                </Box>
            </Stack>
            {trainings.map((training) => {
                const isCompleted = training.status === 'COMPLETED';

                return (
                    <Paper
                        key={training.id}
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            p: { xs: 1.5, sm: 1.75 },
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <Typography
                            sx={{
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: { xs: 13, sm: 14 },
                                fontWeight: 600,
                            }}
                        >
                            {training.name}
                        </Typography>
                        <Box
                            sx={{
                                flexShrink: 0,
                                px: { xs: 1, sm: 1.125 },
                                py: { xs: 0.5, sm: 0.625 },
                                borderRadius: 99,
                                backgroundColor: isCompleted ? '#263725' : '#243348',
                                color: isCompleted ? 'success.main' : 'info.main',
                                fontSize: { xs: 11, sm: 12 },
                                fontWeight: 500,
                                lineHeight: '17px',
                            }}
                        >
                            {isCompleted ? 'Завершена' : 'В работе'}
                        </Box>
                    </Paper>
                );
            })}
        </Stack>
    );
}
