import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { entityDeleteText } from '../constants/entityDeleteText';

export type DeletionImpact = { trainingCount: number };

export type EntityDeleteFeatureProps<TEntity> = {
    entity: TEntity;
    entityName: string;
    getEntityId: (entity: TEntity) => string;
    getDeletionImpact: (entity: TEntity) => Promise<DeletionImpact>;
    onDelete: (entity: TEntity) => Promise<void>;
    onDeleted: (id: string) => void;
};

export function EntityDeleteFeature<TEntity>({
    entity,
    entityName,
    getEntityId,
    getDeletionImpact,
    onDelete,
    onDeleted,
}: EntityDeleteFeatureProps<TEntity>) {
    const [open, setOpen] = useState(false);
    const [impact, setImpact] = useState<DeletionImpact>();
    const [loading, setLoading] = useState(false);

    async function confirm() {
        setLoading(true);
        await onDelete(entity);
        onDeleted(getEntityId(entity));
        setLoading(false);
        setOpen(false);
    }

    async function checkImpact() {
        setLoading(true);
        setImpact(await getDeletionImpact(entity));
        setLoading(false);
    }

    return (
        <>
            <IconButton
                aria-label={entityDeleteText.deleteAriaLabel(entityName)}
                onClick={() => setOpen(true)}
            >
                <DeleteOutlineRoundedIcon />
            </IconButton>
            <Dialog open={open} onClose={() => !loading && setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{entityDeleteText.title(entityName)}</DialogTitle>
                <DialogContent>
                    <Stack gap={2}>
                        <Typography>{entityDeleteText.description}</Typography>
                        {!impact && (
                            <Button onClick={checkImpact} disabled={loading}>
                                {entityDeleteText.checkLinks}
                            </Button>
                        )}
                        {impact && (
                            <Typography
                                color={impact.trainingCount ? 'warning.main' : 'success.main'}
                            >
                                {entityDeleteText.linkedTrainings(impact.trainingCount)}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>
                        {entityDeleteText.cancel}
                    </Button>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={confirm}
                        disabled={!impact || loading}
                    >
                        {entityDeleteText.delete}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
