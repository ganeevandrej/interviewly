'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

import {
    useCreateTopicMutation,
    useDeleteTopicMutation,
    useUpdateTopicMutation,
} from '@/entities/topic';
import type { Topic } from '@/entities/topic';

import { TopicDeleteDialog } from './TopicDeleteDialog';
import { TopicForm } from './TopicForm';
import { TopicList } from './TopicList';

export function TopicManager({
    onClose,
    groupId,
    topics: groupTopics,
}: {
    onClose: () => void;
    groupId: string;
    topics: Topic[];
}) {
    const [createTopic, createState] = useCreateTopicMutation();
    const [updateTopic, updateState] = useUpdateTopicMutation();
    const [deleteTopic, deleteState] = useDeleteTopicMutation();
    const [name, setName] = useState('');
    const [editing, setEditing] = useState<Topic | null>(null);
    const [deleting, setDeleting] = useState<Topic | null>(null);
    const topics = groupTopics.filter((topic) => topic.groupId === groupId);
    const busy = createState.isLoading || updateState.isLoading || deleteState.isLoading;

    async function save() {
        if (!name.trim()) return;

        try {
            if (editing) {
                await updateTopic({ groupId, topicId: editing.id, name: name.trim() }).unwrap();
            } else {
                await createTopic({ groupId, name: name.trim() }).unwrap();
            }

            setName('');
            setEditing(null);
        } catch {
            return;
        }
    }

    async function remove() {
        if (!deleting) return;

        try {
            await deleteTopic({ groupId, topicId: deleting.id }).unwrap();

            if (editing?.id === deleting.id) {
                setEditing(null);
                setName('');
            }

            setDeleting(null);
        } catch {
            return;
        }
    }

    function editTopic(topic: Topic) {
        setEditing(topic);
        setName(topic.name);
    }

    function cancelEditing() {
        setEditing(null);
        setName('');
    }

    return (
        <>
            <Dialog
                open
                onClose={busy ? undefined : onClose}
                fullWidth
                maxWidth="sm"
                aria-labelledby="topics-title"
            >
                <DialogTitle id="topics-title">Темы группы</DialogTitle>
                <DialogContent>
                    <Stack gap={2} sx={{ pt: 1 }}>
                        <TopicForm
                            editing={editing}
                            name={name}
                            busy={busy}
                            onNameChange={setName}
                            onSave={() => void save()}
                            onCancel={cancelEditing}
                        />
                        <TopicList
                            topics={topics}
                            busy={busy}
                            onEdit={editTopic}
                            onDelete={setDeleting}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={busy} onClick={onClose}>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
            <TopicDeleteDialog
                topic={deleting}
                busy={busy}
                onClose={() => setDeleting(null)}
                onConfirm={() => void remove()}
            />
        </>
    );
}
