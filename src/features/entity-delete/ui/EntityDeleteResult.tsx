import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { entityDeleteText } from '../constants/entityDeleteText';

import type { DeletionImpact } from '../model/types';

export function EntityDeleteResult({ impact }: { impact: DeletionImpact }) {
    if (!impact.trainingCount)
        return (
            <NoDependencies>
                <CheckCircleRoundedIcon />
                {entityDeleteText.noDependencies}
            </NoDependencies>
        );
    return (
        <LinkedSection>
            <LinkedHeader>
                <LinkedTitle>{entityDeleteText.linkedTrainingsTitle}</LinkedTitle>
                <LinkedCount>{impact.trainingCount}</LinkedCount>
            </LinkedHeader>
            <LinkedList>
                {impact.trainings?.map((training) => (
                    <LinkedRow key={training.id}>
                        <LinkedName>{training.name}</LinkedName>
                        <TrainingStatus status={training.status}>
                            {entityDeleteText.trainingStatus[training.status]}
                        </TrainingStatus>
                    </LinkedRow>
                ))}
            </LinkedList>
        </LinkedSection>
    );
}

const NoDependencies = styled(Stack)(({ theme }) => ({
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    borderRadius: 12,
    backgroundColor: '#263725',
    color: theme.palette.success.main,
    fontSize: 14,
    fontWeight: 500,
}));

const LinkedSection = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(1),
}));

const LinkedHeader = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 0, 0.5),
}));

const LinkedTitle = styled(Typography)({
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
});

const LinkedCount = styled(Typography)({
    color: '#B0BEC7',
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '19px',
});

const LinkedList = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(1),
}));

const LinkedRow = styled(Stack)(({ theme }) => ({
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(1.75),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    backgroundColor: '#181E23',
}));

const LinkedName = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
});

const TrainingStatus = styled(Box, { shouldForwardProp: (prop) => prop !== 'status' })<{
    status: 'IN_PROGRESS' | 'COMPLETED';
}>(({ status }) => ({
    flexShrink: 0,
    padding: '5px 9px',
    borderRadius: 99,
    backgroundColor: status === 'COMPLETED' ? '#263725' : '#243348',
    color: status === 'COMPLETED' ? '#A4D79A' : '#A6C8F0',
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '17px',
}));
