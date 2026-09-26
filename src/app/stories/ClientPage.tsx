'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import type { Story } from '@/types';

export default function StoriesPage({ initialStories }: { initialStories: Story[] }) {
  const stories = initialStories;
  const isLoading = false;
  const errorMessage = '';
  return (
    <AppShell>
      <Stack gap={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
            Истории
          </Typography>
          <Button
            component={Link}
            href="/stories/new"
            variant="contained"
            startIcon={<AddRoundedIcon />}
          >
            Новая история
          </Button>
        </Stack>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {isLoading && <Typography color="text.secondary">Загрузка историй…</Typography>}
        {!isLoading && !stories.length && !errorMessage && (
          <Typography color="text.secondary">Историй пока нет.</Typography>
        )}
        <Stack gap={1.5}>
          {stories.map((story) => (
            <GlassPanel
              key={story.id}
              component={Link}
              href={`/stories/${story.id}`}
              sx={{ p: 2.5 }}
            >
              <Typography variant="h6">{story.title}</Typography>
            </GlassPanel>
          ))}
        </Stack>
      </Stack>
    </AppShell>
  );
}
