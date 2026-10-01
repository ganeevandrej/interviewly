'use client';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import type { Training } from '../model/types';

export function TrainingCard({ training }: { training: Training }) {
    const isCompleted = training.status === 'COMPLETED';
    const timer = training.questionLimit ? `${training.questionLimit} сек.` : 'Без таймера';

    return (
        <CardRoot variant="outlined">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Chip
                    label={isCompleted ? 'Завершена' : 'В работе'}
                    size="small"
                    sx={(theme) => ({
                        height: { xs: 24, md: 27 },
                        borderRadius: '999px',
                        backgroundColor: isCompleted ? '#263725' : '#243348',
                        color: isCompleted ? theme.palette.success.main : theme.palette.info.main,
                        fontSize: { xs: 11, md: 12 },
                        fontWeight: 500,
                    })}
                />
                <MoreHorizRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </Stack>
            <TrainingName>{training.name}</TrainingName>
            <TrainingMeta>
                <Stack direction="row" alignItems="center" gap={1}>
                    <SubjectOutlinedIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    <Typography sx={{ fontSize: { xs: 11, md: 13 } }}>
                        {training.order === 'RANDOM' ? 'Случайный порядок' : 'Последовательно'}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                    <TimerOutlinedIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    <Typography sx={{ fontSize: { xs: 11, md: 13 } }}>{timer}</Typography>
                </Stack>
            </TrainingMeta>
            <Box sx={{ flex: 1 }} />
            <Button
                component={Link}
                href={`/trainings/${training.id}`}
                variant="outlined"
                sx={{ alignSelf: 'flex-start', px: 2 }}
            >
                Открыть
            </Button>
        </CardRoot>
    );
}

const CardRoot = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minHeight: 180,
    flexDirection: 'column',
    gap: theme.spacing(1.75),
    padding: theme.spacing(2.25),
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: { minHeight: 220, padding: theme.spacing(2.75) },
}));

const TrainingName = styled(Typography)(({ theme }) => ({
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.45,
    [theme.breakpoints.up('md')]: { minHeight: 52, fontSize: 18 },
}));

const TrainingMeta = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    gap: theme.spacing(1.75),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('md')]: { flexDirection: 'column', gap: theme.spacing(1) },
}));
