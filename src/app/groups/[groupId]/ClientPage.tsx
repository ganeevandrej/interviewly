'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { TopicManager } from '@/components/TopicManager';
import { QuestionList } from '@/components/QuestionList';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import type { MouseEvent } from 'react';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import { GroupDialog } from '@/components/GroupDialog';
import { QuestionDialog } from '@/components/QuestionDialog';
import {
  useDeleteGroupMutation,
  useDeleteQuestionMutation,
  useUpdateGroupMutation,
  useUpdateQuestionMutation,
  useCreateQuestionMutation,
} from '@/services/libraryApi';
import Alert from '@mui/material/Alert';

import type { InterviewlyData, LibraryGroup, Question } from '@/types';

export default function GroupPage({ initialGroup }: { initialGroup: LibraryGroup }) {
  const params = { groupId: initialGroup.id };
  const router = useRouter();
  const [data, setData] = useState<InterviewlyData>(() => ({
    groups: [initialGroup],
    topics: initialGroup.topics,
    questions: initialGroup.topics.flatMap((topic) =>
      topic.questions.map((question) => ({ ...question, groupId: initialGroup.id })),
    ),
  }));
  const [deleteGroup, deleteGroupState] = useDeleteGroupMutation();
  const [deleteQuestion, deleteQuestionState] = useDeleteQuestionMutation();
  const [updateGroup, updateGroupState] = useUpdateGroupMutation();
  const [updateQuestion, updateQuestionState] = useUpdateQuestionMutation();
  const [createQuestion, createQuestionState] = useCreateQuestionMutation();
  const groups = data.groups;
  const topics = data.topics.filter((topic) => topic.groupId === params.groupId);
  const allQuestions = data.questions;
  const pending =
    deleteGroupState.isLoading ||
    deleteQuestionState.isLoading ||
    updateGroupState.isLoading ||
    updateQuestionState.isLoading ||
    createQuestionState.isLoading;
  const group = groups.find((item) => item.id === params.groupId);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [initialTopicId, setInitialTopicId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const groupQuestions = useMemo(
    () => allQuestions.filter((question) => question.groupId === params.groupId),
    [params.groupId, allQuestions],
  );
  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? groupQuestions.filter((question) => question.question.toLowerCase().includes(normalized))
      : groupQuestions;
  }, [groupQuestions, query]);

  const questionsByTopic = new Map<string | null, Question[]>();
  for (const question of filteredQuestions) {
    const list = questionsByTopic.get(question.topicId) ?? [];
    list.push(question);
    questionsByTopic.set(question.topicId, list);
  }

  if (!group) {
    return (
      <AppShell>
        <Stack gap={2}>
          <Typography variant="h4">Группа не найдена</Typography>
          <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
            Вернуться на главную
          </Button>
        </Stack>
      </AppShell>
    );
  }

  const openQuestionMenu = (event: MouseEvent<HTMLElement>, question: Question) => {
    setEditingQuestion(question);
    setMenuAnchor(event.currentTarget);
  };

  const openCreateQuestion = (topicId: string | null = null) => {
    setInitialTopicId(topicId);
    setEditingQuestion(undefined);
    setQuestionDialogOpen(true);
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(group.id).unwrap();
      router.push('/');
    } catch {
      return;
    }
  };

  const handleDeleteQuestion = async () => {
    if (!editingQuestion) {
      return;
    }

    try {
      await deleteQuestion({ groupId: group.id, questionId: editingQuestion.id }).unwrap();
      setData((current) => ({
        ...current,
        questions: current.questions.filter((question) => question.id !== editingQuestion.id),
      }));
      setMenuAnchor(null);
    } catch {
      return;
    }
  };

  return (
    <AppShell onCreate={() => openCreateQuestion()}>
      <Stack gap={3}>
        {(deleteGroupState.error || deleteQuestionState.error) && (
          <Alert severity="error">Не удалось выполнить действие.</Alert>
        )}
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ alignSelf: 'start' }}
        >
          Мои группы
        </Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
          <Stack direction="row" gap={2} alignItems="center">
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center',
                background: group.accentColor,
                color: 'background.default',
                fontWeight: 900,
                fontSize: 24,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {group.name.slice(0, 2).toUpperCase()}
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                {group.name}
              </Typography>
              <Typography color="text.secondary">{groupQuestions.length} вопросов</Typography>
            </Box>
          </Stack>
          <Stack direction="row" gap={1}>
            <Button startIcon={<EditRoundedIcon />} onClick={() => setGroupDialogOpen(true)}>
              Редактировать
            </Button>
            <Button
              disabled={pending}
              color="error"
              startIcon={<DeleteRoundedIcon />}
              onClick={handleDeleteGroup}
            >
              Удалить
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
          <TextField
            fullWidth
            placeholder="Поиск по вопросам..."
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
            onClick={() => openCreateQuestion()}
          >
            Добавить вопрос
          </Button>
        </Stack>

        <Button sx={{ alignSelf: 'start' }} onClick={() => setTopicsOpen(true)}>
          Управление темами
        </Button>
        {topics.map((topic) => {
          const questions = questionsByTopic.get(topic.id) ?? [];
          if (query.trim() && !questions.length) return null;
          return (
            <Accordion
              key={topic.id}
              defaultExpanded
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon />}
                id={'topic-' + topic.id + '-header'}
                aria-controls={'topic-' + topic.id + '-content'}
              >
                <Typography sx={{ overflowWrap: 'anywhere' }}>
                  {topic.name} · {questions.length}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack gap={2}>
                  <QuestionList questions={questions} onQuestionMenu={openQuestionMenu} />
                  {!questions.length && (
                    <Typography color="text.secondary">В этой теме пока нет вопросов.</Typography>
                  )}
                  <Button
                    sx={{ alignSelf: 'start' }}
                    startIcon={<AddRoundedIcon />}
                    onClick={() => openCreateQuestion(topic.id)}
                  >
                    Добавить вопрос в тему
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
        {!filteredQuestions.length && (
          <GlassPanel sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              {query.trim()
                ? 'Ничего не найдено.'
                : 'В группе пока нет вопросов. Добавьте вопрос в тему или в «Без темы».'}
            </Typography>
          </GlassPanel>
        )}
      </Stack>

      <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setQuestionDialogOpen(true);
          }}
        >
          Редактировать / изменить тему
        </MenuItem>
        <MenuItem
          disabled={pending}
          onClick={handleDeleteQuestion}
          sx={{ color: 'error.main' }}
        >
          Удалить
        </MenuItem>
      </Menu>

      {topicsOpen && <TopicManager groupId={group.id} topics={topics} onClose={() => setTopicsOpen(false)} />}
      <GroupDialog
        open={groupDialogOpen}
        group={group}
        onClose={() => setGroupDialogOpen(false)}
        busy={updateGroupState.isLoading}
        error={updateGroupState.error ? 'Не удалось сохранить группу.' : null}
        onSave={(payload) => updateGroup({ id: group.id, input: payload }).unwrap().then((updated) => {
          setData((current) => ({ ...current, groups: [updated] }));
        })}
      />
      <QuestionDialog
        open={questionDialogOpen}
        question={editingQuestion}
        topics={topics}
        initialTopicId={initialTopicId}
        onClose={() => {
          setQuestionDialogOpen(false);
          setEditingQuestion(undefined);
        }}
        busy={updateQuestionState.isLoading || createQuestionState.isLoading}
        error={updateQuestionState.error || createQuestionState.error ? 'Не удалось сохранить вопрос.' : null}
        onSave={(payload) => {
          if (editingQuestion) {
            return updateQuestion({ groupId: group.id, questionId: editingQuestion.id, input: payload }).unwrap().then((updated) => {
              setData((current) => ({ ...current, questions: current.questions.map((question) => question.id === updated.id ? { ...updated, groupId: group.id } : question) }));
            });
          }
          return createQuestion({ groupId: group.id, input: payload }).unwrap().then((created) => {
            setData((current) => ({ ...current, questions: [...current.questions, { ...created, groupId: group.id }] }));
          });
        }}
      />
    </AppShell>
  );
}
