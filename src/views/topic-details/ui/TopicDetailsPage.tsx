'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

import { QuestionDeleteAdapter } from '@/features/question-delete';
import { QuestionUpsertDialog } from '@/features/question-upsert';
import { ThemeEditAdapter } from '@/features/theme-edit';
import { questionFromLibrary, updateLibraryQuestion } from '@/views/category-details/model/categoryDetailsModel';
import { topicDetailsText } from '@/views/topic-details/constants/topicDetailsText';
import { AppShell } from '@/widgets/app-shell';

import type { CategoryLibrary } from '@/entities/category';
import type { QuestionDraft } from '@/entities/question';

export default function TopicDetailsPage({
    initialLibrary,
    topicId,
}: {
    initialLibrary: CategoryLibrary;
    topicId: string;
}) {
    const [library, setLibrary] = useState(initialLibrary);
    const [isEditing, setEditing] = useState(false);
    const [draft, setDraft] = useState<QuestionDraft>();
    const topic = library.topics.find((item) => item.id === topicId);

    if (!topic) {
        return (
            <AppShell>
                <Typography variant="h4">{topicDetailsText.notFound}</Typography>
            </AppShell>
        );
    }

    const questions = questionFromLibrary(library).filter((item) => item.topicId === topicId);

    function removeQuestion(questionId: string) {
        setLibrary((current) => ({
            ...current,
            questions: current.questions.filter((item) => item.id !== questionId),
            categoryQuestions: current.categoryQuestions.filter(
                (item) => item.questionId !== questionId,
            ),
            topicQuestions: current.topicQuestions.filter((item) => item.questionId !== questionId),
        }));
    }

    return (
        <AppShell>
            <Stack gap={3}>
                <Button
                    component={Link}
                    href={`/knowledge-base/category/${library.category.id}`}
                    startIcon={<ArrowBackRoundedIcon />}
                    sx={{ alignSelf: 'start' }}
                >
                    {topicDetailsText.backToCategory}
                </Button>
                <Stack direction="row" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box>
                        <Typography variant="h3">{topic.name}</Typography>
                        <Typography color="text.secondary">{topicDetailsText.description}</Typography>
                    </Box>
                    <IconButton onClick={() => setEditing(true)} aria-label={topicDetailsText.editTopic}>
                        <EditRoundedIcon />
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">{topicDetailsText.questionsTitle}</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => setDraft({ question: '', answer: '', topicId })}
                    >
                        {topicDetailsText.addQuestion}
                    </Button>
                </Stack>
                {questions.length ? (
                    <Stack gap={1}>
                        {questions.map((question) => (
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
                                            href={`/knowledge-base/category/${library.category.id}/topic/${topic.id}/focus/${question.id}`}
                                            aria-label={topicDetailsText.openFocus}
                                        >
                                            <PlayArrowRoundedIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => setDraft(question)}
                                            aria-label={topicDetailsText.editQuestion}
                                        >
                                            <EditRoundedIcon />
                                        </IconButton>
                                        <QuestionDeleteAdapter
                                            question={question}
                                            onDeleted={removeQuestion}
                                        />
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">{topicDetailsText.emptyTitle}</Typography>
                        <Typography color="text.secondary">
                            {topicDetailsText.emptyDescription}
                        </Typography>
                    </Paper>
                )}
            </Stack>
            {isEditing && (
                <ThemeEditAdapter
                    topic={topic}
                    open
                    onClose={() => setEditing(false)}
                    onUpdated={(updatedTopic) => {
                        setLibrary((current) => ({
                            ...current,
                            topics: current.topics.map((item) =>
                                item.id === updatedTopic.id ? updatedTopic : item,
                            ),
                        }));
                        setEditing(false);
                    }}
                />
            )}
            <QuestionUpsertDialog
                categoryId={library.category.id}
                open={Boolean(draft)}
                draft={draft}
                topics={library.topics}
                onClose={() => setDraft(undefined)}
                onSaved={(question) => {
                    setLibrary((current) => updateLibraryQuestion(current, question));
                }}
                onChange={setDraft}
            />
        </AppShell>
    );
}
