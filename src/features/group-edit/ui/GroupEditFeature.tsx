'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';

import { useUpdateGroupMutation } from '@/entities/group';
import type { QuestionGroup } from '@/entities/group';
type GroupDialogProps = {
    open: boolean;
    group?: QuestionGroup;
    onClose: () => void;
    onSave: (payload: Omit<QuestionGroup, 'id'>) => Promise<void>;
    busy?: boolean;
    error?: string | null;
};

export function GroupEditFeature({
    group,
    onSaved,
    dialog: Dialog,
}: {
    group: QuestionGroup;
    onSaved: (group: QuestionGroup) => void;
    dialog: (props: GroupDialogProps) => React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [updateGroup, { error, isLoading }] = useUpdateGroupMutation();

    return (
        <>
            <Button onClick={() => setOpen(true)}>Редактировать</Button>
            {Dialog({
                open,
                group,
                onClose: () => setOpen(false),
                busy: isLoading,
                error: error ? 'Не удалось сохранить группу.' : null,
                onSave: (payload) =>
                    updateGroup({ id: group.id, input: payload })
                        .unwrap()
                        .then((updated) => {
                            onSaved(updated);
                            setOpen(false);
                        })
            })}
        </>
    );
}
