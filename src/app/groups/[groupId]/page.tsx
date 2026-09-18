'use client';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { CategoryManager } from '@/components/CategoryManager';
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
import { useParams, useRouter } from 'next/navigation';
import { MouseEvent, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { GlassPanel } from '@/components/GlassPanel';
import { GroupDialog } from '@/components/GroupDialog';
import { QuestionDialog } from '@/components/QuestionDialog';
import { useInterviewlyStore } from '@/store/useInterviewlyStore';
import { Question } from '@/types';

export default function GroupPage() {
  const params = useParams<{ groupId: string }>();
  const router = useRouter();
  const store = useInterviewlyStore();
  const group = store.groups.find((item) => item.id === params.groupId);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [initialCategoryId, setInitialCategoryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const groupQuestions = useMemo(
    () => store.questions.filter((question) => question.groupId === params.groupId),
    [params.groupId, store.questions],
  );
  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? groupQuestions.filter((question) => question.question.toLowerCase().includes(normalized))
      : groupQuestions;
  }, [groupQuestions, query]);

  const categoryIds = new Set(
    store.groupCategories
      .filter((link) => link.groupId === params.groupId)
      .map((link) => link.categoryId),
  );
  const categories = store.categories.filter((category) => categoryIds.has(category.id));
  const questionsByCategory = new Map<string | null, Question[]>();
  for (const question of filteredQuestions) {
    const list = questionsByCategory.get(question.categoryId) ?? [];
    list.push(question);
    questionsByCategory.set(question.categoryId, list);
  }

  if (!store.hydrated)
    return (
      <AppShell>
        <Typography>Загрузка…</Typography>
      </AppShell>
    );
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

  const openCreateQuestion = (categoryId: string | null = null) => {
    setInitialCategoryId(categoryId);
    setEditingQuestion(undefined);
    setQuestionDialogOpen(true);
  };

  const handleDeleteGroup = () => {
    store.deleteGroup(group.id);
    router.push('/');
  };

  return (
    <AppShell onCreate={() => openCreateQuestion()}>
      <Stack gap={3}>
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
                boxShadow: `0 0 42px ${group.accentColor}77`,
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
            <Button color="error" startIcon={<DeleteRoundedIcon />} onClick={handleDeleteGroup}>
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

        <Button sx={{ alignSelf: 'start' }} onClick={() => setCategoriesOpen(true)}>
          Управление категориями
        </Button>
        <QuestionList
          questions={questionsByCategory.get(null) ?? []}
          onQuestionMenu={openQuestionMenu}
        />
        {categories.map((category) => {
          const questions = questionsByCategory.get(category.id) ?? [];
          if (query.trim() && !questions.length) return null;
          return (
            <Accordion key={category.id} defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon />}
                id={'category-' + category.id + '-header'}
                aria-controls={'category-' + category.id + '-content'}
              >
                <Typography sx={{ overflowWrap: 'anywhere' }}>
                  {category.name} · {questions.length}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack gap={2}>
                  <QuestionList questions={questions} onQuestionMenu={openQuestionMenu} />
                  {!questions.length && (
                    <Typography color="text.secondary">
                      В этой категории пока нет вопросов.
                    </Typography>
                  )}
                  <Button
                    sx={{ alignSelf: 'start' }}
                    startIcon={<AddRoundedIcon />}
                    onClick={() => openCreateQuestion(category.id)}
                  >
                    Добавить вопрос в категорию
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
                : 'В группе пока нет вопросов. Добавьте вопрос в категорию или непосредственно в группу.'}
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
          Редактировать / изменить категорию
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (editingQuestion) store.deleteQuestion(editingQuestion.id);
            setMenuAnchor(null);
          }}
          sx={{ color: 'error.main' }}
        >
          Удалить
        </MenuItem>
      </Menu>

      {categoriesOpen && (
        <CategoryManager open groupId={group.id} onClose={() => setCategoriesOpen(false)} />
      )}
      <GroupDialog
        open={groupDialogOpen}
        group={group}
        onClose={() => setGroupDialogOpen(false)}
        onSave={(payload) => store.updateGroup(group.id, payload)}
      />
      <QuestionDialog
        open={questionDialogOpen}
        question={editingQuestion}
        categories={categories}
        initialCategoryId={initialCategoryId}
        onClose={() => {
          setQuestionDialogOpen(false);
          setEditingQuestion(undefined);
        }}
        onSave={(payload) => {
          if (editingQuestion) store.updateQuestion(editingQuestion.id, payload);
          else store.createQuestion({ ...payload, groupId: group.id });
        }}
      />
    </AppShell>
  );
}
