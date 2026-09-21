'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { GlassPanel } from '@/components/GlassPanel';
import { QuestionDialog } from '@/components/QuestionDialog';
import { useInterviewlyStore } from '@/store/useInterviewlyStore';

export default function FocusPage() {
  const params = useParams<{ groupId: string; questionId: string }>();
  return (
    <FocusQuestion
      key={params.groupId + '/' + params.questionId}
      groupId={params.groupId}
      questionId={params.questionId}
    />
  );
}

function FocusQuestion({ groupId, questionId }: { groupId: string; questionId: string }) {
  const router = useRouter();
  const store = useInterviewlyStore();
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const group = store.groups.find((item) => item.id === groupId);
  const questions = useMemo(
    () => store.questions.filter((question) => question.groupId === groupId),
    [groupId, store.questions],
  );
  const currentIndex = questions.findIndex((question) => question.id === questionId);
  const current = questions[currentIndex];
  const topic = store.topics.find((item) => item.id === current?.topicId);

  if (!group || !current) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Вопрос не найден
        </Typography>
        <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
          На главную
        </Button>
      </Box>
    );
  }

  const goToQuestion = (index: number) => {
    const next = questions[index];
    if (!next) return;
    router.push(`/groups/${group.id}/focus/${next.id}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 3,
      }}
    >
      <Box sx={{ width: 'min(940px, 100%)' }}>
        <Stack gap={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Button
              component={Link}
              href={`/groups/${group.id}`}
              startIcon={<ArrowBackRoundedIcon />}
            >
              Выйти
            </Button>
            <Stack alignItems="center">
              <Typography variant="h6">{group.name}</Typography>
              <Typography color="text.secondary">
                {currentIndex + 1} / {questions.length}
              </Typography>
            </Stack>
            <Button endIcon={<EditRoundedIcon />} onClick={() => setEditing(true)}>
              Редактировать
            </Button>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={((currentIndex + 1) / questions.length) * 100}
            sx={{ maxWidth: 320, alignSelf: 'center', width: '100%', borderRadius: 999 }}
          />

          <Box sx={{ perspective: '1400px' }}>
            <Box
              onClick={() => setFlipped((value) => !value)}
              sx={{
                position: 'relative',
                minHeight: { xs: 420, md: 480 },
                transformStyle: 'preserve-3d',
                transition: 'transform .65s cubic-bezier(.2,.7,.2,1)',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                cursor: 'pointer',
              }}
            >
              {[
                {
                  title: current.question,
                  hint: 'Нажмите, чтобы показать ответ',
                  rotate: 'rotateY(0deg)',
                },
                { title: current.answer, hint: 'Ответ', rotate: 'rotateY(180deg)' },
              ].map((side) => (
                <GlassPanel
                  key={side.rotate}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    p: { xs: 3, md: 6 },
                    borderColor: `${group.accentColor}66`,
                    boxShadow: `0 0 90px ${group.accentColor}22`,
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
                    sx={{
                      mb: 2,
                      overflowWrap: 'anywhere',
                      maxHeight: 80,
                      overflow: 'auto',
                      flexShrink: 0,
                    }}
                  >
                    {topic?.name ?? 'Без темы'}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {side.hint}
                  </Typography>
                  <Typography
                    variant={flipped ? 'h6' : 'h4'}
                    sx={{
                      whiteSpace: 'pre-wrap',
                      overflow: 'auto',
                      maxHeight: '100%',
                      lineHeight: 1.6,
                      pr: 1,
                    }}
                  >
                    {side.title}
                  </Typography>
                </GlassPanel>
              ))}
            </Box>
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton
              disabled={currentIndex === 0}
              onClick={() => goToQuestion(currentIndex - 1)}
              aria-label="Предыдущий"
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Button
              component={Link}
              href={`/groups/${group.id}`}
              endIcon={<ArrowOutwardRoundedIcon />}
            >
              К группе
            </Button>
            <IconButton
              disabled={currentIndex === questions.length - 1}
              onClick={() => goToQuestion(currentIndex + 1)}
              aria-label="Следующий"
            >
              <ArrowForwardRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <QuestionDialog
        open={editing}
        question={current}
        topics={store.topics.filter((topic) => topic.groupId === groupId)}
        onClose={() => setEditing(false)}
        onSave={(payload) => store.updateQuestion(groupId, current.id, payload)}
      />
    </Box>
  );
}
