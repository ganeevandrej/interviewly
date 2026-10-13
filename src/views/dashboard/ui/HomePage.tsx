'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { HomeHero } from '@/views/dashboard/ui/HomeHero';
import { InterviewFeature } from '@/views/dashboard/ui/InterviewFeature';
import { SectionNavigation } from '@/views/dashboard/ui/SectionNavigation';
import { TrainingSection } from '@/views/dashboard/ui/TrainingSection';

import { AppShell } from '@/widgets/app-shell';

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
