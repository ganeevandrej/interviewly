'use client';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';


import { useDeleteQuestionMutation } from '@/entities/question';

import type { Question } from '@/entities/question';
import type { MouseEvent } from 'react';

export function QuestionDeleteFeature({
    groupId,
    question,
    onEdit,
    onDeleted,
}: {
    groupId: string;
    question: Question;
    onEdit: () => void;
    onDeleted: (questionId: string) => void;
}) {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [deleteQuestion, state] = useDeleteQuestionMutation();

    function openMenu(event: MouseEvent<HTMLElement>) {
        setAnchor(event.currentTarget);
    }

    async function remove() {
        try {
            await deleteQuestion({ groupId, questionId: question.id }).unwrap();
            onDeleted(question.id);
            setAnchor(null);
        } catch {
            return;
        }
    }

    return (
        <>
            <Button size="small" onClick={openMenu}>
                Действия
            </Button>
            <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)}>
                <MenuItem
                    onClick={() => {
                        setAnchor(null);
                        onEdit();
                    }}
                >
                    Редактировать / изменить тему
                </MenuItem>
                <MenuItem disabled={state.isLoading} onClick={remove} sx={{ color: 'error.main' }}>
                    Удалить
                </MenuItem>
            </Menu>
        </>
    );
}
