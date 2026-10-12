import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { entityDeleteText } from '../constants/entityDeleteText';

export function CheckLinksView({ checking, onCheck }: { checking: boolean; onCheck: () => void }) {
    return (
        <CheckLinksButton onClick={onCheck} disabled={checking}>
            <LinkRoundedIcon />
            {checking ? entityDeleteText.checking : entityDeleteText.checkLinks}
        </CheckLinksButton>
    );
}

export function ImpactErrorView({ onRetry }: { onRetry: () => void }) {
    return (
        <ErrorPanel>
            <ErrorMessage>
                <Box display="flex" alignItems="center" gap={0.5}>
                    <ErrorOutlineRoundedIcon color="error" />
                    <ErrorTitle>{entityDeleteText.checkErrorTitle}</ErrorTitle>
                </Box>
                <ErrorDescription>{entityDeleteText.checkErrorDescription}</ErrorDescription>
            </ErrorMessage>
            <RetryButton onClick={onRetry}>{entityDeleteText.retry}</RetryButton>
        </ErrorPanel>
    );
}

const CheckLinksButton = styled(Button)(({ theme }) => ({
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.375, 1.75),
    borderRadius: 12,
    backgroundColor: '#193B38',
    color: theme.palette.primary.main,
    fontSize: 14,
    fontWeight: 600,
    '&:hover': { backgroundColor: '#193B38' },
}));

const ErrorPanel = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.75),
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: 12,
    backgroundColor: theme.palette.error.contrastText,
    alignItems: 'center',
    justifyContent: 'center',
}));

const ErrorMessage = styled(Stack)({ alignItems: 'center', gap: 10 });

const ErrorTitle = styled(Typography)({ fontSize: 14, fontWeight: 600, color: '#FFADB4' });

const ErrorDescription = styled(Typography)({ color: '#B0BEC7', fontSize: 12 });

const RetryButton = styled(Button)(({ theme }) => ({
    minHeight: 39,
    padding: theme.spacing(1, 2),
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: 10,
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error.contrastText,
    fontSize: 13,
    fontWeight: 600,
}));

