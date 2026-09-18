'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CategoryManager } from '@/components/CategoryManager';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import { GroupCard } from '@/components/GroupCard';
import { GroupDialog } from '@/components/GroupDialog';
import { useInterviewlyStore } from '@/store/useInterviewlyStore';

export default function HomePage() {
  const { groups, questions, questionCountByGroup, createGroup } = useInterviewlyStore();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const groupResults = useMemo(
    () =>
      normalizedQuery
        ? groups.filter((group) => group.name.toLowerCase().includes(normalizedQuery))
        : groups,
    [groups, normalizedQuery],
  );
  const questionResults = useMemo(
    () =>
      normalizedQuery
        ? questions.filter((question) => question.question.toLowerCase().includes(normalizedQuery))
        : [],
    [questions, normalizedQuery],
  );

  return (
    <AppShell onCreate={() => setGroupDialogOpen(true)}>
      <Stack gap={4}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr .8fr' },
            gap: 3,
            alignItems: 'end',
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: 30, md: 42 } }}>
              Добрый день! 👋
            </Typography>
            <Typography color="text.secondary" variant="h6">
              Что будем повторять сегодня?
            </Typography>
          </Box>
          <GlassPanel sx={{ p: 3, display: { xs: 'none', md: 'block' } }}>
            <Typography color="text.secondary">
              Маленькие шаги приводят к большим результатам. Собери свою библиотеку вопросов и
              повторяй в focus-режиме.
            </Typography>
          </GlassPanel>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
          <TextField
            fullWidth
            placeholder="Найти группу или вопрос..."
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
            onClick={() => setGroupDialogOpen(true)}
          >
            Создать группу
          </Button>
        </Stack>

        <Button sx={{ alignSelf: 'start' }} onClick={() => setCategoriesOpen(true)}>
          Управление категориями
        </Button>

        {normalizedQuery ? (
          <Stack gap={3}>
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Группы
              </Typography>
              <Grid container spacing={2}>
                {groupResults.map((group) => (
                  <Grid item xs={12} md={6} lg={4} key={group.id}>
                    <GroupCard group={group} count={questionCountByGroup[group.id] ?? 0} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Вопросы
              </Typography>
              <Stack gap={1.5}>
                {questionResults.map((question) => {
                  const group = groups.find((item) => item.id === question.groupId);
                  return (
                    <GlassPanel
                      key={question.id}
                      component={Link}
                      href={`/groups/${question.groupId}/focus/${question.id}`}
                      sx={{ p: 2 }}
                    >
                      <Stack direction="row" justifyContent="space-between" gap={2}>
                        <Typography>{question.question}</Typography>
                        <Chip size="small" label={group?.name ?? 'Группа'} />
                      </Stack>
                    </GlassPanel>
                  );
                })}
                {!questionResults.length && (
                  <Typography color="text.secondary">Ничего не найдено.</Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        ) : (
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Мои группы
            </Typography>
            <Grid container spacing={2}>
              {groups.map((group) => (
                <Grid item xs={12} md={6} lg={4} key={group.id}>
                  <GroupCard group={group} count={questionCountByGroup[group.id] ?? 0} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>

      {categoriesOpen && <CategoryManager open onClose={() => setCategoriesOpen(false)} />}
      <GroupDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        onSave={createGroup}
      />
    </AppShell>
  );
}
