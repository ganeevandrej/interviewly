import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { categoryText } from '../constants/categoryText';
import { formatCount } from '../lib/formatCount';

import type { CategorySummary } from '../model/types';
import type { ReactNode } from 'react';

type CategoryCardProps = {
    category: CategorySummary;
    action?: ReactNode;
};

export function CategoryCard({ category, action }: CategoryCardProps) {
    return (
        <CardRoot variant="outlined">
            <DesktopContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <DesktopIcon color={category.accentColor}>
                        <FolderOutlinedIcon />
                    </DesktopIcon>
                    {action}
                </Stack>
                <Typography variant="h5" sx={{ mt: 2 }}>
                    {category.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    {formatCount(category.topicsCount, ...categoryText.topics)} ·{' '}
                    {formatCount(category.questionsCount, ...categoryText.questions)}
                </Typography>
                <ProgressTrack>
                    <ProgressValue color={category.accentColor} />
                </ProgressTrack>
                <Button
                    component={Link}
                    href={`/knowledge-base/category/${category.id}`}
                    variant="outlined"
                    sx={{ alignSelf: 'end', minWidth: 180, mt: 2.25 }}
                >
                    {categoryText.open}
                </Button>
            </DesktopContent>
            <MobileContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" gap={1.5} alignItems="center">
                        <MobileDot color={category.accentColor} />
                        <Typography variant="h5">{category.name}</Typography>
                    </Stack>
                    {action}
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    {formatCount(category.topicsCount, ...categoryText.topics)} ·{' '}
                    {formatCount(category.questionsCount, ...categoryText.questions)}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Button
                    component={Link}
                    href={`/knowledge-base/category/${category.id}`}
                    variant="outlined"
                    sx={{ alignSelf: 'end', minWidth: 113, mt: 1.5 }}
                >
                    {categoryText.openShort}
                </Button>
            </MobileContent>
        </CardRoot>
    );
}

const CardRoot = styled(Paper)(({ theme }) => ({
    minHeight: 154,
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: { minHeight: 259, padding: theme.spacing(3) },
}));

const DesktopContent = styled(Stack)(({ theme }) => ({
    display: 'none',
    height: '100%',
    [theme.breakpoints.up('md')]: { display: 'flex' },
}));

const MobileContent = styled(Stack)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    [theme.breakpoints.up('md')]: { display: 'none' },
}));

const DesktopIcon = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' })<{
    color: string;
}>(({ color }) => ({
    display: 'grid',
    width: 44,
    height: 44,
    placeItems: 'center',
    borderRadius: 6,
    backgroundColor: color,
    color: 'primary.contrastText',
}));

const MobileDot = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' })<{ color: string }>(
    ({ color }) => ({
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: color,
    }),
);

const ProgressTrack = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 4,
    marginTop: theme.spacing(2),
    borderRadius: 999,
    backgroundColor: theme.palette.divider,
    overflow: 'hidden',
}));

const ProgressValue = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' })<{
    color: string;
}>(({ color }) => ({
    width: 68,
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: color,
}));
