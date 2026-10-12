import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import type { EntitySummary } from '../model/types';

export function EntityDeleteSummary({ summary }: { summary: EntitySummary }) {
    return (
        <SummaryCard>
            <SummaryDot color={summary.accentColor} />
            <Box>
                <SummaryTitle>{summary.title}</SummaryTitle>
                <SummaryMeta>{summary.meta}</SummaryMeta>
            </Box>
        </SummaryCard>
    );
}

const SummaryCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    minHeight: 100,
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    backgroundColor: '#181E23',
}));

const SummaryDot = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' })<{
    color?: string;
}>(({ color }) => ({
    width: 12,
    height: 12,
    flexShrink: 0,
    borderRadius: '50%',
    backgroundColor: color ?? '#70DECF',
}));

const SummaryTitle = styled(Typography)({
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '22px'
});

const SummaryMeta = styled(Typography)({
    color: '#B0BEC7',
    fontSize: 13,
    lineHeight: '19px'
});
