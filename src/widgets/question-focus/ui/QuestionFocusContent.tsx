'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { QuestionEditFeature } from '@/features/question-edit';

import { QuestionCard } from './QuestionCard';

import type { Question } from '@/entities/question';
import type { LibraryGroup } from '@/shared/types/library';


export function QuestionFocusContent({
    initialGroup,
    questionId,
}: {
    initialGroup: LibraryGroup;
    questionId: string;
}) {
    return (
        <FocusQuestion
            key={initialGroup.id + '/' + questionId}
            initialGroup={initialGroup}
            groupId={initialGroup.id}
            questionId={questionId}
        />
    );
}

function FocusQuestion({
    initialGroup,
    groupId,
    questionId,
}: {
    initialGroup: LibraryGroup;
    groupId: string;
    questionId: string;
}) {
    const router = useRouter();
    const [flipped, setFlipped] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question>();
    const [questions, setQuestions] = useState<Question[]>(() =>
        initialGroup.topics.flatMap((topic) =>
            topic.questions.map((question) => ({ ...question, groupId: initialGroup.id })),
        ),
    );
    const topics = initialGroup.topics;
    const group = groupId === initialGroup.id ? initialGroup : undefined;
    const currentQuestions = useMemo(
        () => questions.filter((question) => question.groupId === groupId),
        [groupId, questions],
    );
    const currentIndex = currentQuestions.findIndex((question) => question.id === questionId);
    const current = currentQuestions[currentIndex];
    const topic = topics.find((item) => item.id === current?.topicId);

    if (!group || !current) {
        return (
            <Box sx={{ minHeight: '100vh', p: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Вопрос не найден
                </Typography>
                <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
                    На главную
                </Button>
            </Box>
        );
    }

    function goToQuestion(index: number) {
        const next = currentQuestions[index];

        if (next) router.push(`/groups/${groupId}/focus/${next.id}`);
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                px: { xs: 2, md: 4 },
                py: { xs: 2, md: 4 },
            }}
        >
            <Box sx={{ width: 'min(940px, 100%)' }}>
                <Stack gap={3}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                    >
                        <Button
                            component={Link}
                            href={`/groups/${group.id}`}
                            startIcon={<ArrowBackRoundedIcon />}
                        >
                            Выйти
                        </Button>
                        <Stack alignItems="center">
                            <Typography variant="h6" sx={{ color: 'text.primary' }}>
                                {group.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {currentIndex + 1} / {currentQuestions.length}
                            </Typography>
                        </Stack>
                        <Button
                            endIcon={<EditRoundedIcon />}
                            onClick={() => setEditingQuestion(current)}
                        >
                            Редактировать
                        </Button>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={((currentIndex + 1) / currentQuestions.length) * 100}
                        sx={{
                            maxWidth: 320,
                            alignSelf: 'center',
                            width: '100%',
                            borderRadius: 999,
                            height: 6,
                            backgroundColor: '#27323A',
                            '& .MuiLinearProgress-bar': { backgroundColor: 'primary.main' },
                        }}
                    />
                    <QuestionCard
                        question={current}
                        topic={topic}
                        flipped={flipped}
                        onFlip={() => setFlipped((value) => !value)}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <IconButton
                            disabled={currentIndex === 0}
                            onClick={() => goToQuestion(currentIndex - 1)}
                            aria-label="Предыдущий"
                        >
                            <ArrowBackRoundedIcon />
                        </IconButton>
                        <Button
                            component={Link}
                            href={`/groups/${group.id}`}
                            endIcon={<ArrowOutwardRoundedIcon />}
                        >
                            К группе
                        </Button>
                        <IconButton
                            disabled={currentIndex === currentQuestions.length - 1}
                            onClick={() => goToQuestion(currentIndex + 1)}
                            aria-label="Следующий"
                        >
                            <ArrowForwardRoundedIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>
            <QuestionEditFeature
                groupId={group.id}
                question={editingQuestion}
                topics={topics}
                onClose={() => setEditingQuestion(undefined)}
                onUpdated={(updated) => {
                    setQuestions((currentQuestions) =>
                        currentQuestions.map((question) =>
                            question.id === updated.id
                                ? { ...updated, groupId: group.id }
                                : question,
                        ),
                    );
                    setEditingQuestion(undefined);
                }}
            />
        </Box>
    );
}
