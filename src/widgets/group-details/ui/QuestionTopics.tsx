'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';

import type { Question } from '@/entities/question';
import { QuestionList } from '@/entities/question';
import type { Topic } from '@/entities/topic';
import { QuestionCreateFeature } from '@/features/question-create';
import { QuestionDeleteFeature } from '@/features/question-delete';
import { QuestionDialog, QuestionEditFeature } from '@/features/question-edit';
import { TopicManager } from '@/features/topic-manage';
import { GlassPanel } from '@/shared/ui/glass-panel';

import { filterQuestions, groupQuestionsByTopic } from '../model/groupQuestions';

export function QuestionTopics({
    groupId,
    topics,
    questions,
    createRequest,
    onQuestionsChange,
}: {
    groupId: string;
    topics: Topic[];
    questions: Question[];
    createRequest: number;
    onQuestionsChange: (questions: Question[]) => void;
}) {
    const [query, setQuery] = useState('');
    const [topicsOpen, setTopicsOpen] = useState(false);
    const [initialTopicId, setInitialTopicId] = useState<string | null>(null);
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question>();
    const filteredQuestions = useMemo(() => filterQuestions(questions, query), [questions, query]);
    const questionsByTopic = useMemo(
        () => groupQuestionsByTopic(filteredQuestions),
        [filteredQuestions],
    );

    useEffect(() => {
        if (createRequest > 0) openCreateQuestion();
    }, [createRequest]);

    function openCreateQuestion(topicId: string | null = null) {
        setInitialTopicId(topicId);
        setEditingQuestion(undefined);
        setQuestionDialogOpen(true);
    }

    return (
        <>
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
                const topicQuestions = questionsByTopic.get(topic.id) ?? [];
                if (query.trim() && !topicQuestions.length) return null;

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
                            id={`topic-${topic.id}-header`}
                            aria-controls={`topic-${topic.id}-content`}
                        >
                            <Typography sx={{ overflowWrap: 'anywhere' }}>
                                {topic.name} · {topicQuestions.length}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack gap={2}>
                                <QuestionList
                                    questions={topicQuestions}
                                    onQuestionMenu={(_event, question) =>
                                        setEditingQuestion(question)
                                    }
                                />
                                {!topicQuestions.length && (
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

            {topicsOpen && (
                <TopicManager
                    groupId={groupId}
                    topics={topics}
                    onClose={() => setTopicsOpen(false)}
                />
            )}
            <QuestionCreateFeature
                groupId={groupId}
                topics={topics}
                initialTopicId={initialTopicId}
                open={questionDialogOpen && !editingQuestion}
                onClose={() => setQuestionDialogOpen(false)}
                dialog={QuestionDialog}
                onCreated={(created) => {
                    onQuestionsChange([...questions, created]);
                    setQuestionDialogOpen(false);
                }}
            />
            <QuestionEditFeature
                groupId={groupId}
                question={editingQuestion}
                topics={topics}
                onClose={() => setEditingQuestion(undefined)}
                onUpdated={(updated) => {
                    onQuestionsChange(
                        questions.map((question) =>
                            question.id === updated.id ? { ...updated, groupId } : question,
                        ),
                    );
                    setEditingQuestion(undefined);
                }}
            />
            {editingQuestion && (
                <QuestionDeleteFeature
                    groupId={groupId}
                    question={editingQuestion}
                    onEdit={() => setQuestionDialogOpen(true)}
                    onDeleted={(questionId) => {
                        onQuestionsChange(
                            questions.filter((question) => question.id !== questionId),
                        );
                        setEditingQuestion(undefined);
                    }}
                />
            )}
        </>
    );
}
