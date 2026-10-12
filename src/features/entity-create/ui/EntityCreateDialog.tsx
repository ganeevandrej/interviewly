import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { EntityColorSelectFeature } from '@/features/entity-color-select';

import { entityCreateText } from '../constants/entityCreateText';

export type EntityCreateDialogProps = {
    open: boolean;
    title: string;
    description?: string;
    nameLabel?: string;
    colorLabel?: string;
    submitLabel?: string;
    onClose: () => void;
    onSubmit: (input: { name: string; color: string }) => Promise<void> | void;
};

export function EntityCreateDialog({
    open,
    title,
    description,
    nameLabel = entityCreateText.nameLabel,
    colorLabel,
    submitLabel = entityCreateText.create,
    onClose,
    onSubmit,
}: EntityCreateDialogProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState<string>();

    async function submit() {
        if (!color) return;

        await onSubmit({ name: name.trim(), color });
        setName('');
        onClose();
    }

    return (
        <CreateDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Header>
                <Typography component="h2" variant="h4">
                    {title}
                </Typography>
                {description && <Description color="text.secondary">{description}</Description>}
            </Header>
            <Divider />
            <Body>
                <Stack gap={2.25}>
                    <NameField
                        label={nameLabel}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        autoFocus
                    />
                    <EntityColorSelectFeature
                        value={color}
                        label={colorLabel}
                        onChange={setColor}
                    />
                </Stack>
            </Body>
            <Divider />
            <Actions>
                <Button onClick={onClose}>{entityCreateText.cancel}</Button>
                <Button variant="contained" onClick={submit} disabled={!name.trim()}>
                    {submitLabel}
                </Button>
            </Actions>
        </CreateDialog>
    );
}

const CreateDialog = styled(Dialog)(({ theme }) => ({
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
        '& .MuiDialog-paper': {
            maxWidth: '100%',
            margin: 0,
            borderRadius: '20px 20px 0 0',
        },
    },
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(3, 3.5),
}));

const Description = styled(Typography)({
    fontSize: 14,
    lineHeight: '20px',
});

const Body = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3, 3.5),
}));

const NameField = styled(TextField)({
    '& .MuiInputBase-root': {
        minHeight: 100,
        alignItems: 'flex-start',
    },
});
const Actions = styled(DialogActions)(({ theme }) => ({
    minHeight: 78,
    gap: theme.spacing(1.25),
    padding: theme.spacing(2, 3.5, 2.25),
    '& .MuiButton-root': {
        minHeight: 42,
        padding: theme.spacing(1.375, 2.25),
        borderRadius: 12,
    },
}));
