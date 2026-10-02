'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AppShell } from '@/widgets/app-shell';

import { HomeHero } from './HomeHero';
import { InterviewFeature } from './InterviewFeature';
import { SectionNavigation } from './SectionNavigation';
import { TrainingSection } from './TrainingSection';

import type { Training } from '@/entities/training';

export default function HomePage({ trainings }: { trainings: Training[] }) {
    return (
        <AppShell>
            <Stack gap={{ xs: 3.5, md: 4 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        height: 48,
                        color: 'text.secondary',
                    }}
                >
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Главная</Typography>
                    <Typography sx={{ fontSize: 14 }}>Сегодня, 30 сентября</Typography>
                </Stack>

                {/* блок с приветствием и поиском */}
                <HomeHero />

                {/* блок с тренировками */}
                <TrainingSection trainings={trainings} />

                {/* блок с навигацией на разделы */}
                <SectionNavigation />

                {/* блок с интервью */}
                <InterviewFeature />
            </Stack>
        </AppShell>
    );
}
