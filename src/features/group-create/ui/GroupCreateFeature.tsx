'use client';

import { useState } from 'react';

import { useCreateGroupMutation } from '@/entities/group';
import type { QuestionGroup } from '@/entities/group';

import { GroupDialog } from './GroupDialog';

export function GroupCreateFeature({
    initialGroups,
    children,
}: {
    initialGroups: QuestionGroup[];
    children: (props: {
        groups: QuestionGroup[];
        openCreateDialog: () => void;
    }) => React.ReactNode;
}) {
    const [groups, setGroups] = useState(initialGroups);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [createGroup, createState] = useCreateGroupMutation();

    async function create(payload: Omit<QuestionGroup, 'id'>) {
        const created = await createGroup(payload).unwrap();
        setGroups((current) => [...current, created]);
    }

    return (
        <>
            {children({
                groups,
                openCreateDialog: () => setIsDialogOpen(true),
            })}
            <GroupDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                busy={createState.isLoading}
                error={createState.error ? 'Не удалось создать группу.' : null}
                onSave={create}
            />
        </>
    );
}
