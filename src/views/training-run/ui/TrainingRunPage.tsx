'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAcceptTrainingQuestionMutation } from '@/entities/training';

import type { Training } from '@/entities/training';

export default function TrainingRunPage({ initialTraining }: { initialTraining: Training }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialId = searchParams.get('questionId') ?? initialTraining.questions[0]?.id;
    const [questions, setQuestions] = useState(initialTraining.questions);
    const [questionId, setQuestionId] = useState(initialId);
    const [showAnswer, setShowAnswer] = useState(false);
    const [seconds, setSeconds] = useState(initialTraining.questionLimit ?? 0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [acceptQuestion] = useAcceptTrainingQuestionMutation();
    const index = questions.findIndex((question) => question.id === questionId);
    const current = questions[index];

    useEffect(() => {
        if (!timerRunning || !seconds) return;
        const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);

        return () => window.clearTimeout(timer);
    }, [seconds, timerRunning]);

    if (!current) return <Typography>В тренировке нет вопросов.</Typography>;

    function navigate(nextIndex: number) {
        const next = questions[nextIndex];
        if (!next) return;
        setQuestionId(next.id);
        setShowAnswer(false);
        setTimerRunning(false);
        setSeconds(initialTraining.questionLimit ?? 0);
    }

    async function accept() {
        const training = await acceptQuestion({
            trainingId: initialTraining.id,
            questionId: current.id,
        }).unwrap();
        setQuestions(training.questions);
        if (index < training.questions.length - 1) navigate(index + 1);
        else router.push(`/trainings/${initialTraining.id}`);
    }

    return (
        <Stack sx={{ minHeight: '100vh', maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }} gap={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button
                    component={Link}
                    href={`/trainings/${initialTraining.id}`}
                    startIcon={<ArrowBackRoundedIcon />}
                >
                    Выйти
                </Button>
                <Typography>
                    {index + 1} из {questions.length}
                </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={((index + 1) / questions.length) * 100} />
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, minHeight: 320 }}>
                <Stack gap={3}>
                    <Typography variant="h4">{current.question}</Typography>
                    {showAnswer && (
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{current.answer}</Typography>
                    )}
                    <Button onClick={() => setShowAnswer((value) => !value)}>
                        {showAnswer ? 'Скрыть ответ' : 'Показать ответ'}
                    </Button>
                </Stack>
            </Paper>
            {initialTraining.questionLimit && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography>Таймер: {seconds} с</Typography>
                    <Button onClick={() => setTimerRunning((value) => !value)} disabled={!seconds}>
                        {timerRunning ? 'Пауза' : 'Старт'}
                    </Button>
                </Stack>
            )}
            <Stack direction="row" justifyContent="space-between">
                <Button
                    onClick={() => navigate(index - 1)}
                    disabled={index === 0}
                    startIcon={<ArrowBackRoundedIcon />}
                >
                    Предыдущий
                </Button>
                <Button variant="contained" onClick={accept}>
                    Ответил
                </Button>
                <Button
                    onClick={() => navigate(index + 1)}
                    disabled={index === questions.length - 1}
                    endIcon={<ArrowForwardRoundedIcon />}
                >
                    Следующий
                </Button>
            </Stack>
        </Stack>
    );
}
