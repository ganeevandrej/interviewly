import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { formatCount } from '../lib/formatCount';

import type { CategorySummary } from '../model/types';

type CategoryIdentityProps = {
    category: CategorySummary;
};

export function CategoryIdentity({ category }: CategoryIdentityProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                display: 'flex',
                minHeight: 100,
                alignItems: 'center',
                gap: { xs: 1.375, sm: 1.5 },
                px: { xs: 1.75, sm: 2 },
                borderRadius: '12px',
                backgroundColor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: category.accentColor,
                }}
            />
            <Box>
                <Typography
                    sx={{
                        fontSize: { xs: 14, sm: 15 },
                        fontWeight: 600,
                        lineHeight: { xs: '20px', sm: '22px' },
                    }}
                >
                    {category.name}
                </Typography>
                <Typography
                    sx={{ fontSize: { xs: 12, sm: 13 }, lineHeight: { xs: '17px', sm: '19px' } }}
                    color="text.secondary"
                >
                    {formatCount(category.topicsCount, 'тема', 'темы', 'тем')} ·{' '}
                    {formatCount(category.questionsCount, 'вопрос', 'вопроса', 'вопросов')}
                </Typography>
            </Box>
        </Paper>
    );
}
