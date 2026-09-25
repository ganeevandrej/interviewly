'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import { storiesApi } from '@/client/stories';

import type { Story } from '@/types';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    storiesApi
      .list()
      .then(setStories)
      .catch((reason: Error) => setError(reason.message));
  }, []);
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
        {error && <Typography color="error">{error}</Typography>}
        {!stories.length && !error && (
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
