import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { TrainingCard } from '@/entities/training';

import { EmptyTrainings } from './EmptyTrainings';
import { TrainingSectionHeader } from './TrainingSectionHeader';

import type { Training } from '@/entities/training';

export function TrainingSection({ trainings }: { trainings: Training[] }) {
    return (
        <Stack gap={4}>
            <TrainingSectionHeader />
            {trainings.length ? (
                <TrainingGrid>
                    {trainings.map((training) => (
                        <TrainingCard key={training.id} training={training} />
                    ))}
                </TrainingGrid>
            ) : (
                <EmptyTrainings />
            )}
        </Stack>
    );
}

const TrainingGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
}));