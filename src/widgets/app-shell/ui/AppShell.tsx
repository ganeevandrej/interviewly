'use client';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ReactNode } from 'react';

type AppShellProps = {
    children: ReactNode;
};

const items = [
    { href: '/', label: 'Главная', icon: <HomeRoundedIcon /> },
    { href: '/stories', label: 'Истории', icon: <MenuBookRoundedIcon /> },
    { href: '/projects', label: 'Проекты', icon: <WorkOutlineRoundedIcon /> },
    { href: '/knowledge-base', label: 'База знаний', icon: <MenuBookRoundedIcon /> },
    { href: '/trainings', label: 'Тренировки', icon: <SchoolRoundedIcon /> },
    { href: '/interview', label: 'Собеседование', icon: <RecordVoiceOverRoundedIcon /> },
];

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();

    function navigationItem(item: (typeof items)[number], mobile = false) {
        const isCurrent = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
            <Button
                key={item.href}
                component={Link}
                href={item.href}
                startIcon={item.icon}
                aria-current={isCurrent ? 'page' : undefined}
                sx={{
                    justifyContent: mobile ? 'center' : 'start',
                    color: isCurrent ? 'primary.main' : 'text.secondary',
                    backgroundColor: isCurrent
                        ? (theme) => theme.interviewly.surfaces.primarySubtle
                        : undefined,
                    ...(mobile ? { minWidth: 0, flexDirection: 'column', fontSize: 10 } : {}),
                }}
            >
                {item.label}
            </Button>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: { md: 'flex' } }}>
            <Box
                component="aside"
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    width: 248,
                    p: 2,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.default',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Typography variant="h6">Interviewly</Typography>
                <Stack gap={1}>{items.map((item) => navigationItem(item))}</Stack>
            </Box>

            <Box component="main" sx={{ flex: 1, pb: { xs: 10, md: 0 } }}>
                <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
                    {children}
                </Container>
            </Box>

            <Box
                component="nav"
                sx={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 'appBar',
                    display: { xs: 'grid', md: 'none' },
                    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                    px: 1,
                    py: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                }}
            >
                {items.map((item) => navigationItem(item, true))}
            </Box>
        </Box>
    );
}
