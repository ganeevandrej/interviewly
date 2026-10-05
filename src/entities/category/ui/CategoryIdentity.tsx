import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { categoryText } from '../constants/categoryText';
import { formatCount } from '../lib/formatCount';

import type { CategorySummary } from '../model/types';

type CategoryIdentityProps = {
    category: CategorySummary;
};

export function CategoryIdentity({ category }: CategoryIdentityProps) {
    return (
        <IdentityRoot variant="outlined">
            <AccentDot color={category.accentColor} />
            <Box>
                <CategoryName>{category.name}</CategoryName>
                <Typography
                    sx={{ fontSize: { xs: 12, sm: 13 }, lineHeight: { xs: '17px', sm: '19px' } }}
                    color="text.secondary"
                >
                    {formatCount(category.topicsCount, ...categoryText.topics)} ·{' '}
                    {formatCount(category.questionsCount, ...categoryText.questions)}
                </Typography>
            </Box>
        </IdentityRoot>
    );
}

const IdentityRoot = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minHeight: 100,
    alignItems: 'center',
    gap: theme.spacing(1.375),
    padding: theme.spacing(0, 1.75),
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: { gap: theme.spacing(1.5), padding: theme.spacing(0, 2) },
}));

const AccentDot = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' })<{
    color: string;
}>(({ color }) => ({ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }));

const CategoryName = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    [theme.breakpoints.up('sm')]: { fontSize: 15, lineHeight: '22px' },
}));
