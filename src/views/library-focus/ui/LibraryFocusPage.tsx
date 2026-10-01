'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FocusQuestion = { id: string; question: string; answer: string };

export default function LibraryFocusPage({
    title,
    backHref,
    questions,
    questionId,
    focusHref,
}: {
    title: string;
    backHref: string;
    questions: FocusQuestion[];
    questionId: string;
    focusHref: (id: string) => string;
}) {
    const router = useRouter();
    const [showAnswer, setShowAnswer] = useState(false);
    const index = questions.findIndex((question) => question.id === questionId);
    const current = questions[index];

    if (!current) return <Typography>Вопрос не найден.</Typography>;

    function navigate(nextIndex: number) {
        const next = questions[nextIndex];
        if (next) router.push(focusHref(next.id));
    }

    return (
        <Stack sx={{ minHeight: '100vh', maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }} gap={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button component={Link} href={backHref} startIcon={<ArrowBackRoundedIcon />}>
                    Выйти
                </Button>
                <Stack alignItems="center">
                    <Typography>{title}</Typography>
                    <Typography color="text.secondary">
                        {index + 1} из {questions.length}
                    </Typography>
                </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={((index + 1) / questions.length) * 100} />
            <Paper variant="outlined" sx={{ minHeight: 320, p: { xs: 3, md: 6 } }}>
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
            <Stack direction="row" justifyContent="space-between">
                <Button
                    onClick={() => navigate(index - 1)}
                    disabled={index === 0}
                    startIcon={<ArrowBackRoundedIcon />}
                >
                    Предыдущий
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
