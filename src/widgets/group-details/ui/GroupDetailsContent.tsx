'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { TopicManager } from '@/features/topic-manage';
import { QuestionList } from '@/entities/question';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { GlassPanel } from '@/shared/ui/glass-panel';
import type { LibraryData, LibraryGroup } from '@/shared/types/library';
import {
    QuestionCreateFeature,
} from '@/features/question-create';
import { QuestionDeleteFeature } from '@/features/question-delete';
import { QuestionEditFeature } from '@/features/question-edit';
import { QuestionDialog } from '@/features/question-edit';
import { GroupDeleteFeature } from '@/features/group-delete';
import { GroupEditFeature } from '@/features/group-edit';
import { GroupDialog } from '@/features/group-create';

import type { Question } from '@/entities/question';
import type { QuestionGroup } from '@/entities/group';
import type { Topic } from '@/entities/topic';

export function GroupDetailsContent({
    initialGroup,
    shell,
}: {
    initialGroup: LibraryGroup;
    shell: (children: React.ReactNode, onCreate: () => void) => React.ReactNode;
}) {
    const params = { groupId: initialGroup.id };
    const [data, setData] = useState<LibraryData>(() => ({
        groups: [initialGroup],
        topics: initialGroup.topics,
        questions: initialGroup.topics.flatMap((topic) =>
            topic.questions.map((question) => ({ ...question, groupId: initialGroup.id })),
        ),
    }));
    const groups = data.groups;
    const topics = data.topics.filter((topic) => topic.groupId === params.groupId);
    const allQuestions = data.questions;
    const group = groups.find((item) => item.id === params.groupId);
    const [topicsOpen, setTopicsOpen] = useState(false);
    const [initialTopicId, setInitialTopicId] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();

    const groupQuestions = useMemo(
        () => allQuestions.filter((question) => question.groupId === params.groupId),
        [params.groupId, allQuestions],
    );
    const filteredQuestions = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return normalized
            ? groupQuestions.filter((question) =>
                  question.question.toLowerCase().includes(normalized),
              )
            : groupQuestions;
    }, [groupQuestions, query]);

    const questionsByTopic = new Map<string | null, Question[]>();
    for (const question of filteredQuestions) {
        const list = questionsByTopic.get(question.topicId) ?? [];
        list.push(question);
        questionsByTopic.set(question.topicId, list);
    }

    if (!group) {
        return shell(
            <Stack gap={2}>
                    <Typography variant="h4">Группа не найдена</Typography>
                    <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
                        Вернуться на главную
                    </Button>
            </Stack>,
            () => undefined,
        );
    }

    const openQuestionMenu = (_event: unknown, question: Question) => {
        setEditingQuestion(question);
    };

    const openCreateQuestion = (topicId: string | null = null) => {
        setInitialTopicId(topicId);
        setEditingQuestion(undefined);
        setQuestionDialogOpen(true);
    };

    return shell(
        <>
            <Stack gap={3}>
                <Button
                    component={Link}
                    href="/"
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ alignSelf: 'start' }}
                >
                    Мои группы
                </Button>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    gap={2}
                >
                    <Stack direction="row" gap={2} alignItems="center">
                        <Box
                            sx={{
                                width: 76,
                                height: 76,
                                borderRadius: '16px',
                                display: 'grid',
                                placeItems: 'center',
                                background: group.accentColor,
                                color: 'background.default',
                                fontWeight: 900,
                                fontSize: 24,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {group.name.slice(0, 2).toUpperCase()}
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                                {group.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {groupQuestions.length} вопросов
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" gap={1}>
                        <GroupEditFeature
                            group={group}
                            dialog={GroupDialog}
                            onSaved={(updated) =>
                                setData((current) => ({ ...current, groups: [updated] }))
                            }
                        />
                        <GroupDeleteFeature groupId={group.id} />
                    </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                    <TextField
                        fullWidth
                        placeholder="Поиск по вопросам..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => openCreateQuestion()}
                    >
                        Добавить вопрос
                    </Button>
                </Stack>

                <Button sx={{ alignSelf: 'start' }} onClick={() => setTopicsOpen(true)}>
                    Управление темами
                </Button>
                {topics.map((topic) => {
                    const questions = questionsByTopic.get(topic.id) ?? [];
                    if (query.trim() && !questions.length) return null;
                    return (
                        <Accordion
                            key={topic.id}
                            defaultExpanded
                            sx={{
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:before': { display: 'none' },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreRoundedIcon />}
                                id={'topic-' + topic.id + '-header'}
                                aria-controls={'topic-' + topic.id + '-content'}
                            >
                                <Typography sx={{ overflowWrap: 'anywhere' }}>
                                    {topic.name} · {questions.length}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack gap={2}>
                                    <QuestionList
                                        questions={questions}
                                        onQuestionMenu={openQuestionMenu}
                                    />
                                    {!questions.length && (
                                        <Typography color="text.secondary">
                                            В этой теме пока нет вопросов.
                                        </Typography>
                                    )}
                                    <Button
                                        sx={{ alignSelf: 'start' }}
                                        startIcon={<AddRoundedIcon />}
                                        onClick={() => openCreateQuestion(topic.id)}
                                    >
                                        Добавить вопрос в тему
                                    </Button>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
                {!filteredQuestions.length && (
                    <GlassPanel sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            {query.trim()
                                ? 'Ничего не найдено.'
                                : 'В группе пока нет вопросов. Добавьте вопрос в тему или в «Без темы».'}
                        </Typography>
                    </GlassPanel>
                )}
            </Stack>

            {topicsOpen && (
                <TopicManager
                    groupId={group.id}
                    topics={topics}
                    onClose={() => setTopicsOpen(false)}
                />
            )}
            <QuestionCreateFeature
                groupId={group.id}
                topics={topics}
                initialTopicId={initialTopicId}
                open={questionDialogOpen && !editingQuestion}
                onClose={() => setQuestionDialogOpen(false)}
                dialog={QuestionDialog}
                onCreated={(created) =>
                    setData((current) => ({
                        ...current,
                        questions: [...current.questions, created],
                    }))
                }
            />
            <QuestionEditFeature
                groupId={group.id}
                question={editingQuestion}
                topics={topics}
                onClose={() => setEditingQuestion(undefined)}
                onUpdated={(updated) =>
                    setData((current) => ({
                        ...current,
                        questions: current.questions.map((question) =>
                            question.id === updated.id
                                ? { ...updated, groupId: group.id }
                                : question,
                        ),
                    }))
                }
            />
            {editingQuestion && (
                <QuestionDeleteFeature
                    groupId={group.id}
                    question={editingQuestion}
                    onEdit={() => setQuestionDialogOpen(true)}
                    onDeleted={(questionId) => {
                        setData((current) => ({
                            ...current,
                            questions: current.questions.filter(
                                (question) => question.id !== questionId,
                            ),
                        }));
                        setEditingQuestion(undefined);
                    }}
                />
            )}
        </>,
        () => openCreateQuestion(),
    );
}
