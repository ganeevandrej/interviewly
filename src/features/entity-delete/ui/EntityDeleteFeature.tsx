import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

import { entityDeleteText } from '../constants/entityDeleteText';


import { EntityDeleteDialog } from './EntityDeleteDialog';

import type { DeletionImpact, EntitySummary } from '../model/types';

export type EntityDeleteFeatureProps<TEntity> = {
    entity: TEntity;
    entityName: string;
    deleteLabel?: string;
    description?: string;
    getEntityId: (entity: TEntity) => string;
    getSummary?: (entity: TEntity) => EntitySummary;
    getDeletionImpact: (entity: TEntity) => Promise<DeletionImpact>;
    onDelete: (entity: TEntity) => Promise<void>;
    onDeleted: (id: string) => void;
};

export function EntityDeleteFeature<TEntity>({
    entity,
    entityName,
    deleteLabel = entityDeleteText.delete,
    description = entityDeleteText.description,
    getEntityId,
    getSummary,
    getDeletionImpact,
    onDelete,
    onDeleted,
}: EntityDeleteFeatureProps<TEntity>) {
    const [open, setOpen] = useState(false);
    const [impact, setImpact] = useState<DeletionImpact>();
    const [isChecking, setChecking] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [hasImpactError, setImpactError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const summary = getSummary?.(entity);

    function openDialog() {
        setOpen(true);
        setImpact(undefined);
        setImpactError(false);
        setDeleteError(false);
    }

    async function checkImpact() {
        setChecking(true);
        setImpactError(false);

        try {
            setImpact(await getDeletionImpact(entity));
        } catch {
            setImpactError(true);
        } finally {
            setChecking(false);
        }
    }

    async function confirm() {
        setDeleting(true);
        setDeleteError(false);

        try {
            await onDelete(entity);
            onDeleted(getEntityId(entity));
            setOpen(false);
        } catch {
            setDeleteError(true);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <IconButton
                aria-label={entityDeleteText.deleteAriaLabel(entityName)}
                onClick={openDialog}
            >
                <DeleteOutlineRoundedIcon />
            </IconButton>
            <EntityDeleteDialog
                open={open}
                onClose={() => !isDeleting && setOpen(false)}
                entityName={entityName}
                description={description}
                summary={summary}
                impact={impact}
                isChecking={isChecking}
                isDeleting={isDeleting}
                hasImpactError={hasImpactError}
                deleteError={deleteError}
                deleteLabel={deleteLabel}
                onCheckImpact={checkImpact}
                onConfirm={confirm}
            />
        </>
    );
}
