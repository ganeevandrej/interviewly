import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { entityDeleteText } from '../constants/entityDeleteText';

import { CheckLinksView, ImpactErrorView } from './EntityDeleteImpact';
import { EntityDeleteResult } from './EntityDeleteResult';
import { EntityDeleteSummary } from './EntityDeleteSummary';

import type { DeletionImpact, EntitySummary } from '../model/types';

type Props = {
    open: boolean;
    entityName: string;
    description: string;
    summary?: EntitySummary;
    impact?: DeletionImpact;
    isChecking: boolean;
    isDeleting: boolean;
    hasImpactError: boolean;
    deleteError: boolean;
    deleteLabel: string;
    onClose: () => void;
    onCheckImpact: () => void;
    onConfirm: () => void;
};

export function EntityDeleteDialog({
    open,
    entityName,
    description,
    summary,
    impact,
    isChecking,
    isDeleting,
    hasImpactError,
    deleteError,
    deleteLabel,
    onClose,
    onCheckImpact,
    onConfirm,
}: Props) {
    return (
        <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogHeader component="div">
                <DialogHeading>{entityDeleteText.title(entityName)}</DialogHeading>
            </DialogHeader>
            <Divider />
            <DialogBody>
                <Stack gap={2}>
                    <Description>{description}</Description>
                    {summary && <EntityDeleteSummary summary={summary} />}
                    {!impact && !hasImpactError && (
                        <Box display="flex" alignItems="center" justifyContent="flex-start">
                            <CheckLinksView checking={isChecking} onCheck={onCheckImpact} />
                        </Box>
                    )}
                    {hasImpactError && <ImpactErrorView onRetry={onCheckImpact} />}
                    {impact && <EntityDeleteResult impact={impact} />}
                    {deleteError && <Alert severity="error">{entityDeleteText.deleteError}</Alert>}
                </Stack>
            </DialogBody>
            <Divider />
            <DialogFooter>
                <CancelButton onClick={onClose} disabled={isDeleting}>
                    {entityDeleteText.cancel}
                </CancelButton>
                <DeleteButton onClick={onConfirm} disabled={!impact || isDeleting}>
                    {deleteLabel}
                </DeleteButton>
            </DialogFooter>
        </StyledDialog>
    );
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: 620,
        maxWidth: 'calc(100% - 32px)',
        margin: theme.spacing(4),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 20,
        backgroundColor: '#20282F',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.4)',
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiDialog-paper': { maxWidth: '100%', margin: 0, borderRadius: '20px 20px 0 0' },
    },
}));

export const DialogHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2.25, 3.5, 1.75),
}));

export const DialogHeading = styled(Box)({ fontSize: 22, fontWeight: 600, lineHeight: '32px' });

export const DialogBody = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3, 3.5),
}));

export const DialogFooter = styled(DialogActions)(({ theme }) => ({
    minHeight: 78,
    gap: theme.spacing(1.25),
    padding: theme.spacing(2, 3.5, 2.25),
    '& .MuiButton-root': { minHeight: 42, padding: theme.spacing(1.375, 2.25), borderRadius: 12 },
}));

export const CancelButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    border: '1px solid #647782',
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    backgroundColor: theme.palette.error.contrastText,
    '&:hover': { backgroundColor: theme.palette.error.contrastText },
}));

export const Description = styled(Typography)({
    color: '#B0BEC7',
    fontSize: 14,
    lineHeight: '20px',
});
