'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';

import { useUpdateGroupMutation } from '@/entities/group';
import type { QuestionGroup } from '@/entities/group';
import { GroupDialog } from '@/features/manage-group';

export function GroupEditFeature({
    group,
    onSaved,
}: {
    group: QuestionGroup;
    onSaved: (group: QuestionGroup) => void;
}) {
    const [open, setOpen] = useState(false);
    const [updateGroup, { error, isLoading }] = useUpdateGroupMutation();

    return (
        <>
            <Button onClick={() => setOpen(true)}>Редактировать</Button>
            <GroupDialog
                open={open}
                group={group}
                onClose={() => setOpen(false)}
                busy={isLoading}
                error={error ? 'Не удалось сохранить группу.' : null}
                onSave={(payload) =>
                    updateGroup({ id: group.id, input: payload })
                        .unwrap()
                        .then((updated) => {
                            onSaved(updated);
                            setOpen(false);
                        })
                }
            />
        </>
    );
}
