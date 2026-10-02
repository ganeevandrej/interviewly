import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { appShellText } from '../constants/appShell';

export function AppBrand({ compact = false }: { compact?: boolean }) {
    return (
        <Stack direction="row" alignItems="center" gap={compact ? 1.25 : 1.5}>
            <BrandMark compact={compact}>I</BrandMark>
            <Typography
                sx={{ color: 'text.primary', fontSize: compact ? 18 : 20, fontWeight: 600 }}
            >
                {appShellText.brand}
            </Typography>
        </Stack>
    );
}

const BrandMark = styled(Box, { shouldForwardProp: (prop) => prop !== 'compact' })<{
    compact: boolean;
}>(({ theme, compact }) => ({
    display: 'grid',
    width: compact ? 32 : 34,
    height: compact ? 32 : 34,
    placeItems: 'center',
    borderRadius: compact ? '9px' : '10px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: compact ? 18 : 20,
    fontWeight: 600,
}));
