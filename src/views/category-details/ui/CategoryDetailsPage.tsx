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
import { useState } from 'react';

import {
    useCreateQuestionMutation,
    useDeleteQuestionMutation,
    useUpdateQuestionMutation,
} from '@/entities/question';
import { CategoryEditAdapter } from '@/features/category-edit';
import { ThemeCreateAdapter } from '@/features/theme-create';
import { ThemeDeleteAdapter } from '@/features/theme-delete';
import { ThemeEditAdapter } from '@/features/theme-edit';
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
    initialCategory,
    hasContentError = false,
    topicId,
}: {
    initialLibrary?: CategoryLibrary;
    initialCategory?: CategoryLibrary['category'];
    hasContentError?: boolean;
    topicId?: string;
}) {
    const router = useRouter();
    const [library, setLibrary] = useState(
        initialLibrary ?? {
            category: initialCategory ?? { id: '', name: '', accentColor: '#70DECF' },
            topics: [],
            questions: [],
            categoryQuestions: [],
            topicQuestions: [],
        },
    );
    const [editingCategory, setEditingCategory] = useState(false);
    const [creatingTopic, setCreatingTopic] = useState(false);
    const [editingTopicId, setEditingTopicId] = useState<string>();
    const [draft, setDraft] = useState<QuestionDraft>();
    const [createQuestion] = useCreateQuestionMutation();
    const [updateQuestion] = useUpdateQuestionMutation();
    const [deleteQuestion] = useDeleteQuestionMutation();

    if (hasContentError) {
        return (
            <AppShell>
                <Stack gap={3}>
                    {initialCategory && (
                        <Box>
                            <Typography variant="h3">{initialCategory.name}</Typography>
                            <Typography color="text.secondary">
                                Создавайте темы и вопросы, чтобы удобно готовиться к собеседованию.
                            </Typography>
                        </Box>
                    )}
                    <Paper
                        variant="outlined"
                        sx={{
                            minHeight: { xs: 404, md: 358 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            textAlign: 'center',
                            backgroundColor: 'error.dark',
                            borderColor: 'error.main',
                        }}
                    >
                        <Typography variant="h5">Не удалось загрузить данные</Typography>
                        <Typography color="text.secondary">
                            Проверьте подключение к интернету и попробуйте ещё раз.
                        </Typography>
                        <Button variant="outlined" color="error" onClick={() => router.refresh()}>
                            Повторить
                        </Button>
                    </Paper>
                </Stack>
            </AppShell>
        );
    }
    const questions = questionFromLibrary(library);
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

    async function removeTopic(id: string) {
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
                {topic && <Button
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
                </Button>}
                <Stack direction="row" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box>
                        <Stack direction="row" gap={1.5} alignItems="center">
                            {!topic && <Box sx={{ width: 8, height: 36, borderRadius: 1, backgroundColor: library.category.accentColor }} />}
                            <Typography variant="h3">{title}</Typography>
                        </Stack>
                        <Typography color="text.secondary">
                            {topic ? 'Вопросы темы' : 'Создавайте темы и вопросы, чтобы удобно готовиться к собеседованию.'}
                        </Typography>
                    </Box>
                    {!topic && (
                        <><Button variant="outlined" onClick={() => setEditingCategory(true)} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Редактировать категорию</Button><IconButton onClick={() => setEditingCategory(true)} aria-label="Редактировать категорию" sx={{ display: { xs: 'inline-flex', md: 'none' } }}><EditRoundedIcon /></IconButton></>
                    )}
                </Stack>
                {!topic && (
                    <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5">Темы</Typography>
                            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setCreatingTopic(true)}>Создать тему</Button>
                        </Stack>
                        {library.topics.length ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                            {library.topics.map((item) => { const questionsCount = library.topicQuestions.filter((link) => link.topicId === item.id).length; return <Paper key={item.id} variant="outlined" sx={{ p: 2.25, display: 'flex', flexDirection: 'column', gap: 1.75, borderRadius: 2 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Stack direction="row" gap={1.25} alignItems="center"><Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.accentColor }} /><Typography fontWeight={600}>{item.name}</Typography></Stack><Stack direction="row"><IconButton size="small" onClick={() => setEditingTopicId(item.id)} aria-label="Редактировать тему"><EditRoundedIcon fontSize="small" /></IconButton><ThemeDeleteAdapter topic={item} questionsCount={questionsCount} onDeleted={removeTopic} /></Stack></Stack><Typography variant="body2" color="text.secondary">{questionsCount} вопросов</Typography><Button component={Link} href={`/knowledge-base/category/${library.category.id}/topic/${item.id}`} variant="outlined" sx={{ alignSelf: 'flex-end' }}>Открыть</Button></Paper>; })}
                        </Box> : <EmptyState title="Пока нет тем" description="Создайте первую тему, чтобы собирать вопросы по направлениям." />}
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
                ) : <EmptyState title={topic ? 'Пока нет вопросов в теме' : 'Пока нет вопросов без темы'} description="Добавляйте вопросы сразу или создавайте темы для удобной группировки." />}
            </Stack>
            <CategoryEditAdapter category={library.category} open={editingCategory} onClose={() => setEditingCategory(false)} onUpdated={(category) => { setLibrary((current) => ({ ...current, category })); setEditingCategory(false); }} />
            <ThemeCreateAdapter categoryId={library.category.id} open={creatingTopic} onClose={() => setCreatingTopic(false)} onCreated={(topic) => { setLibrary((current) => ({ ...current, topics: [...current.topics, topic] })); setCreatingTopic(false); }} />
            {editingTopicId && <ThemeEditAdapter topic={library.topics.find((item) => item.id === editingTopicId)!} open onClose={() => setEditingTopicId(undefined)} onUpdated={(topic) => { setLibrary((current) => ({ ...current, topics: current.topics.map((item) => item.id === topic.id ? topic : item) })); setEditingTopicId(undefined); }} />}
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

function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                minHeight: { xs: 208, md: 176 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                p: 3,
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    width: 64,
                    height: 64,
                    placeItems: 'center',
                    borderRadius: 2,
                    color: 'primary.main',
                    backgroundColor: 'primary.dark',
                    fontSize: 26,
                }}
            >
                ▰
            </Box>
            <Typography fontSize={18} fontWeight={600}>{title}</Typography>
            <Typography color="text.secondary">{description}</Typography>
        </Paper>
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
