'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
  onCreate?: () => void;
};

export function AppShell({ children, onCreate }: AppShellProps) {
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
        <Stack gap={1}>
          <Button
            component={Link}
            href="/"
            startIcon={<HomeRoundedIcon />}
            sx={{
              justifyContent: 'start',
              backgroundColor: (theme) => theme.interviewly.surfaces.primarySubtle,
            }}
          >
            Главная
          </Button>
          <Button
            startIcon={<SearchRoundedIcon />}
            sx={{ justifyContent: 'start', color: 'text.secondary' }}
          >
            Поиск
          </Button>
          <Button
            component={Link}
            href="/stories"
            startIcon={<MenuBookRoundedIcon />}
            sx={{ justifyContent: 'start', color: 'text.secondary' }}
          >
            Истории
          </Button>
          <Button
            component={Link}
            href="/projects"
            startIcon={<WorkOutlineRoundedIcon />}
            sx={{ justifyContent: 'start', color: 'text.secondary' }}
          >
            Проекты
          </Button>
          <Button
            startIcon={<SettingsRoundedIcon />}
            sx={{ justifyContent: 'start', color: 'text.secondary' }}
          >
            Настройки
          </Button>
        </Stack>
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
          gridTemplateColumns: 'repeat(6, 1fr)',
          px: 1,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Button
          component={Link}
          href="/"
          startIcon={<HomeRoundedIcon />}
          sx={{ minWidth: 0, flexDirection: 'column' }}
        >
          Главная
        </Button>
        <Button
          startIcon={<SearchRoundedIcon />}
          sx={{ minWidth: 0, flexDirection: 'column', color: 'text.secondary' }}
        >
          Поиск
        </Button>
        <Button
          onClick={onCreate}
          startIcon={<AddRoundedIcon />}
          sx={{ minWidth: 0, flexDirection: 'column' }}
        >
          Создать
        </Button>
        <Button
          component={Link}
          href="/stories"
          startIcon={<MenuBookRoundedIcon />}
          sx={{ minWidth: 0, flexDirection: 'column', color: 'text.secondary' }}
        >
          Истории
        </Button>
        <Button
          component={Link}
          href="/projects"
          startIcon={<WorkOutlineRoundedIcon />}
          sx={{ minWidth: 0, flexDirection: 'column', color: 'text.secondary' }}
        >
          Проекты
        </Button>
        <Button
          startIcon={<SettingsRoundedIcon />}
          sx={{ minWidth: 0, flexDirection: 'column', color: 'text.secondary' }}
        >
          Настройки
        </Button>
      </Box>
    </Box>
  );
}
