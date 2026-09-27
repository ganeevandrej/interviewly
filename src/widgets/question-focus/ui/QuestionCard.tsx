'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GlassPanel } from '@/shared/ui/glass-panel';
import type { Question } from '@/entities/question';
import type { Topic } from '@/entities/topic';

export function QuestionCard({
    question,
    topic,
    flipped,
    onFlip,
}: {
    question: Question;
    topic?: Topic;
    flipped: boolean;
    onFlip: () => void;
}) {
    const sides = [
        {
            title: question.question,
            hint: 'Нажмите, чтобы показать ответ',
            rotate: 'rotateY(0deg)',
        },
        { title: question.answer, hint: 'Ответ', rotate: 'rotateY(180deg)' },
    ];

    return (
        <Box sx={{ perspective: '1400px' }}>
            <Box
                onClick={onFlip}
                sx={{
                    position: 'relative',
                    minHeight: { xs: 420, md: 480 },
                    transformStyle: 'preserve-3d',
                    transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    cursor: 'pointer',
                }}
            >
                {sides.map((side) => (
                    <GlassPanel
                        key={side.rotate}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            p: { xs: 3, md: 6 },
                            borderColor: 'divider',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                            backfaceVisibility: 'hidden',
                            transform: side.rotate,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, overflowWrap: 'anywhere', maxHeight: 80, overflow: 'auto', flexShrink: 0 }}
                        >
                            {topic?.name ?? 'Без темы'}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            {side.hint}
                        </Typography>
                        <Typography
                            variant={flipped ? 'h6' : 'h4'}
                            sx={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '100%', lineHeight: 1.6, pr: 1 }}
                        >
                            {side.title}
                        </Typography>
                    </GlassPanel>
                ))}
            </Box>
        </Box>
    );
}
