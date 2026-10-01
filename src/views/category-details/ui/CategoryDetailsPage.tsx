'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useDeleteCategoryMutation, useUpdateCategoryMutation } from '@/entities/category';
import {
    useCreateQuestionMutation,
    useDeleteQuestionMutation,
    useUpdateQuestionMutation,
} from '@/entities/question';
import {
    useCreateTopicMutation,
    useDeleteTopicMutation,
    useUpdateTopicMutation,
} from '@/entities/topic';
import { AppShell } from '@/widgets/app-shell';

import type { CategoryLibrary, CategoryQuestion } from '@/entities/category';

type QuestionDraft = { id?: string; question: string; answer: string; topicId: string | null };

function questionFromLibrary(library: CategoryLibrary): CategoryQuestion[] {
    const topicByQuestionId = new Map(
        library.topicQuestions.map((link) => [link.questionId, link.topicId]),
    );
    const positionByQuestionId = new Map(
        library.categoryQuestions.map((link) => [link.questionId, link.position]),
    );

    return library.questions
        .map((question) => ({
            ...question,
            categoryId: library.category.id,
            topicId: topicByQuestionId.get(question.id) ?? null,
            position: positionByQuestionId.get(question.id) ?? 0,
        }))
        .toSorted((left, right) => left.position - right.position);
}

export default function CategoryDetailsPage({
    initialLibrary,
    topicId,
}: {
    initialLibrary: CategoryLibrary;
    topicId?: string;
}) {
    const router = useRouter();
    const [library, setLibrary] = useState(initialLibrary);
    const [editingCategory, setEditingCategory] = useState(false);
    const [topicName, setTopicName] = useState('');
    const [editingTopicId, setEditingTopicId] = useState<string>();
    const [draft, setDraft] = useState<QuestionDraft>();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [createTopic] = useCreateTopicMutation();
    const [updateTopic] = useUpdateTopicMutation();
    const [deleteTopic] = useDeleteTopicMutation();
    const [createQuestion] = useCreateQuestionMutation();
    const [updateQuestion] = useUpdateQuestionMutation();
    const [deleteQuestion] = useDeleteQuestionMutation();
    const questions = useMemo(() => questionFromLibrary(library), [library]);
    const topic = topicId ? library.topics.find((item) => item.id === topicId) : undefined;
    const visibleQuestions = topicId
        ? questions.filter((item) => item.topicId === topicId)
        : questions.filter((item) => !item.topicId);

    if (topicId && !topic) {
        return (
            <AppShell>
                <Typography variant="h4">Тема не найдена</Typography>
            </AppShell>
        );
    }

    async function saveCategory(name: string, accentColor: string) {
        const category = await updateCategory({
            id: library.category.id,
            input: { name, accentColor },
        }).unwrap();

        setLibrary((current) => ({ ...current, category }));
        setEditingCategory(false);
    }

    async function removeCategory() {
        await deleteCategory(library.category.id).unwrap();
        router.replace('/knowledge-base');
    }

    async function saveTopic() {
        if (!topicName.trim()) return;

        if (editingTopicId) {
            const updated = await updateTopic({
                categoryId: library.category.id,
                topicId: editingTopicId,
                name: topicName,
            }).unwrap();
            setLibrary((current) => ({
                ...current,
                topics: current.topics.map((item) => (item.id === updated.id ? updated : item)),
            }));
        } else {
            const created = await createTopic({
                categoryId: library.category.id,
                name: topicName,
            }).unwrap();
            setLibrary((current) => ({ ...current, topics: [...current.topics, created] }));
        }

        setTopicName('');
        setEditingTopicId(undefined);
    }

    async function removeTopic(id: string) {
        await deleteTopic({ categoryId: library.category.id, topicId: id }).unwrap();
        setLibrary((current) => ({
            ...current,
            topics: current.topics.filter((item) => item.id !== id),
            topicQuestions: current.topicQuestions.filter((link) => link.topicId !== id),
        }));
        if (topicId === id) router.replace(`/knowledge-base/category/${library.category.id}`);
    }

    async function saveQuestion() {
        if (!draft || !draft.question.trim() || !draft.answer.trim()) return;

        if (draft.id) {
            const updated = await updateQuestion({
                categoryId: library.category.id,
                questionId: draft.id,
                input: { question: draft.question, answer: draft.answer, topicId: draft.topicId },
            }).unwrap();
            setLibrary((current) => updateLibraryQuestion(current, updated));
        } else {
            const created = await createQuestion({
                categoryId: library.category.id,
                input: draft,
            }).unwrap();
            setLibrary((current) => updateLibraryQuestion(current, created));
        }

        setDraft(undefined);
    }

    async function removeQuestion(questionId: string) {
        await deleteQuestion({ categoryId: library.category.id, questionId }).unwrap();
        setLibrary((current) => ({
            ...current,
            questions: current.questions.filter((item) => item.id !== questionId),
            categoryQuestions: current.categoryQuestions.filter(
                (item) => item.questionId !== questionId,
            ),
            topicQuestions: current.topicQuestions.filter((item) => item.questionId !== questionId),
        }));
    }

    const title = topic ? topic.name : library.category.name;
    const newQuestion = () => setDraft({ question: '', answer: '', topicId: topicId ?? null });

    return (
        <AppShell>
            <Stack gap={3}>
                <Button
                    component={Link}
                    href={
                        topic
                            ? `/knowledge-base/category/${library.category.id}`
                            : '/knowledge-base'
                    }
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ alignSelf: 'start' }}
                >
                    {topic ? 'К категории' : 'К базе знаний'}
                </Button>
                <Stack direction="row" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box>
                        <Typography variant="h3">{title}</Typography>
                        <Typography color="text.secondary">
                            {topic ? 'Вопросы темы' : 'Вопросы категории и её темы'}
                        </Typography>
                    </Box>
                    {!topic && (
                        <Stack direction="row">
                            <IconButton
                                onClick={() => setEditingCategory(true)}
                                aria-label="Редактировать категорию"
                            >
                                <EditRoundedIcon />
                            </IconButton>
                            <IconButton onClick={removeCategory} aria-label="Удалить категорию">
                                <DeleteOutlineRoundedIcon />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
                {!topic && (
                    <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5">Темы</Typography>
                            <Button
                                startIcon={<AddRoundedIcon />}
                                onClick={() => {
                                    setTopicName('');
                                    setEditingTopicId(undefined);
                                }}
                            >
                                Добавить тему
                            </Button>
                        </Stack>
                        <Stack direction="row" gap={1} flexWrap="wrap">
                            {library.topics.map((item) => (
                                <Paper
                                    key={item.id}
                                    variant="outlined"
                                    sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <Button
                                        component={Link}
                                        href={`/knowledge-base/category/${library.category.id}/topic/${item.id}`}
                                    >
                                        {item.name}
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setEditingTopicId(item.id);
                                            setTopicName(item.name);
                                        }}
                                        aria-label="Переименовать тему"
                                    >
                                        <EditRoundedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => removeTopic(item.id)}
                                        aria-label="Удалить тему"
                                    >
                                        <DeleteOutlineRoundedIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Stack>
                        <Stack direction="row" gap={1}>
                            <TextField
                                label={editingTopicId ? 'Название темы' : 'Новая тема'}
                                value={topicName}
                                onChange={(event) => setTopicName(event.target.value)}
                                size="small"
                            />
                            <Button onClick={saveTopic} disabled={!topicName.trim()}>
                                {editingTopicId ? 'Сохранить' : 'Добавить'}
                            </Button>
                        </Stack>
                        <Divider />
                    </>
                )}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5">
                            {topic ? 'Вопросы темы' : 'Вопросы без темы'}
                        </Typography>
                        {!topic && (
                            <Typography color="text.secondary">
                                Эти вопросы принадлежат категории независимо от тем.
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={newQuestion}
                    >
                        Добавить вопрос
                    </Button>
                </Stack>
                {visibleQuestions.length ? (
                    <Stack gap={1}>
                        {visibleQuestions.map((question) => (
                            <Paper key={question.id} variant="outlined" sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" gap={2}>
                                    <Box>
                                        <Typography>{question.question}</Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {question.answer}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row">
                                        <IconButton
                                            component={Link}
                                            href={
                                                topic
                                                    ? `/knowledge-base/category/${library.category.id}/topic/${topic.id}/focus/${question.id}`
                                                    : `/knowledge-base/category/${library.category.id}/focus/${question.id}`
                                            }
                                            aria-label="Открыть focus"
                                        >
                                            <PlayArrowRoundedIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => setDraft(question)}
                                            aria-label="Редактировать вопрос"
                                        >
                                            <EditRoundedIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => removeQuestion(question.id)}
                                            aria-label="Удалить вопрос"
                                        >
                                            <DeleteOutlineRoundedIcon />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Typography color="text.secondary">Вопросов пока нет.</Typography>
                )}
            </Stack>
            <CategoryDialog
                open={editingCategory}
                category={library.category}
                onClose={() => setEditingCategory(false)}
                onSave={saveCategory}
            />
            <QuestionDialog
                open={Boolean(draft)}
                draft={draft}
                topics={library.topics}
                onClose={() => setDraft(undefined)}
                onSave={saveQuestion}
                onChange={setDraft}
            />
        </AppShell>
    );
}

function updateLibraryQuestion(
    library: CategoryLibrary,
    question: CategoryQuestion,
): CategoryLibrary {
    const questions = library.questions.some((item) => item.id === question.id)
        ? library.questions.map((item) =>
              item.id === question.id
                  ? { id: question.id, question: question.question, answer: question.answer }
                  : item,
          )
        : [
              ...library.questions,
              { id: question.id, question: question.question, answer: question.answer },
          ];
    const categoryQuestions = library.categoryQuestions.some(
        (item) => item.questionId === question.id,
    )
        ? library.categoryQuestions
        : [
              ...library.categoryQuestions,
              {
                  categoryId: question.categoryId,
                  questionId: question.id,
                  position: question.position,
              },
          ];
    const withoutQuestion = library.topicQuestions.filter(
        (item) => item.questionId !== question.id,
    );
    const topicQuestions = question.topicId
        ? [
              ...withoutQuestion,
              {
                  topicId: question.topicId,
                  questionId: question.id,
                  position: question.topicPosition ?? 0,
              },
          ]
        : withoutQuestion;

    return { ...library, questions, categoryQuestions, topicQuestions };
}

function CategoryDialog({
    open,
    category,
    onClose,
    onSave,
}: {
    open: boolean;
    category: CategoryLibrary['category'];
    onClose: () => void;
    onSave: (name: string, accentColor: string) => Promise<void>;
}) {
    const [name, setName] = useState(category.name);
    const [accentColor, setAccentColor] = useState(category.accentColor);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Редактировать категорию</DialogTitle>
            <DialogContent>
                <Stack gap={2} sx={{ pt: 1 }}>
                    <TextField
                        label="Название"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                        label="Цвет"
                        value={accentColor}
                        onChange={(event) => setAccentColor(event.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={() => onSave(name, accentColor)} variant="contained">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function QuestionDialog({
    open,
    draft,
    topics,
    onClose,
    onSave,
    onChange,
}: {
    open: boolean;
    draft?: QuestionDraft;
    topics: CategoryLibrary['topics'];
    onClose: () => void;
    onSave: () => Promise<void>;
    onChange: (draft: QuestionDraft) => void;
}) {
    if (!draft) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{draft.id ? 'Редактировать вопрос' : 'Новый вопрос'}</DialogTitle>
            <DialogContent>
                <Stack gap={2} sx={{ pt: 1 }}>
                    <TextField
                        label="Вопрос"
                        value={draft.question}
                        onChange={(event) => onChange({ ...draft, question: event.target.value })}
                        multiline
                        minRows={2}
                    />
                    <TextField
                        label="Ответ"
                        value={draft.answer}
                        onChange={(event) => onChange({ ...draft, answer: event.target.value })}
                        multiline
                        minRows={4}
                    />
                    <TextField
                        select
                        label="Тема"
                        value={draft.topicId ?? ''}
                        onChange={(event) =>
                            onChange({ ...draft, topicId: event.target.value || null })
                        }
                    >
                        <MenuItem value="">Без темы</MenuItem>
                        {topics.map((topic) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={!draft.question.trim() || !draft.answer.trim()}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}
