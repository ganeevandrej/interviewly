'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
    useCreateTrainingMutation,
    useDeleteTrainingMutation,
    useRegenerateTrainingMutation,
    useRestartTrainingMutation,
    useUpdateTrainingMutation,
} from '@/entities/training';
import { AppShell } from '@/widgets/app-shell';

import type { CategoryLibrary } from '@/entities/category';
import type { Training, TrainingInput } from '@/entities/training';

export function TrainingListPage({ trainings }: { trainings: Training[] }) {
    return (
        <AppShell>
            <Stack gap={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">Тренировки</Typography>
                    <Button
                        component={Link}
                        href="/trainings/new"
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                    >
                        Создать тренировку
                    </Button>
                </Stack>
                {trainings.length ? (
                    trainings.map((training) => (
                        <Paper key={training.id} variant="outlined" sx={{ p: 2 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >
                                <Stack>
                                    <Typography variant="h6">{training.name}</Typography>
                                    <Typography color="text.secondary">
                                        {training.status === 'COMPLETED' ? 'Пройдена' : 'В работе'}{' '}
                                        ·{' '}
                                        {
                                            training.questions.filter(
                                                (item) => item.status === 'ACCEPTED',
                                            ).length
                                        }{' '}
                                        из {training.questions.length}
                                    </Typography>
                                </Stack>
                                <Button component={Link} href={`/trainings/${training.id}`}>
                                    Открыть
                                </Button>
                            </Stack>
                        </Paper>
                    ))
                ) : (
                    <Typography color="text.secondary">
                        Создайте тренировку из вопросов базы знаний.
                    </Typography>
                )}
            </Stack>
        </AppShell>
    );
}

export function TrainingFormPage({
    libraries,
    training,
}: {
    libraries: CategoryLibrary[];
    training?: Training;
}) {
    const router = useRouter();
    const [name, setName] = useState(training?.name ?? '');
    const [order, setOrder] = useState<TrainingInput['order']>(training?.order ?? 'SEQUENTIAL');
    const [questionLimit, setQuestionLimit] = useState(training?.questionLimit?.toString() ?? '');
    const [categoryIds, setCategoryIds] = useState<string[]>(
        training?.categories.map((item) => item.id) ?? [],
    );
    const [topicIds, setTopicIds] = useState<string[]>(
        training?.topics.map((item) => item.id) ?? [],
    );
    const [questionIds, setQuestionIds] = useState<string[]>(
        training?.questions.map((item) => item.id) ?? [],
    );
    const [createTraining, createState] = useCreateTrainingMutation();
    const [updateTraining, updateState] = useUpdateTrainingMutation();
    const selectedLibraries = libraries.filter((library) =>
        categoryIds.includes(library.category.id),
    );
    const selectableQuestions = useMemo(
        () => selectedLibraries.flatMap((library) => library.questions),
        [selectedLibraries],
    );

    function toggle(value: string, values: string[], setValues: (items: string[]) => void) {
        setValues(
            values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
        );
    }

    async function submit() {
        const input: TrainingInput = {
            name,
            order,
            questionLimit: questionLimit ? Number(questionLimit) : null,
            categoryIds,
            topicIds,
            questionIds,
        };
        const saved = training
            ? await updateTraining({ id: training.id, input }).unwrap()
            : await createTraining(input).unwrap();
        router.push(`/trainings/${saved.id}`);
    }

    return (
        <AppShell>
            <Stack gap={3}>
                <Typography variant="h3">
                    {training ? 'Настройки тренировки' : 'Новая тренировка'}
                </Typography>
                <TextField
                    label="Название"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <TextField
                    select
                    label="Порядок"
                    value={order}
                    onChange={(event) => setOrder(event.target.value as TrainingInput['order'])}
                >
                    <MenuItem value="SEQUENTIAL">Последовательный</MenuItem>
                    <MenuItem value="RANDOM">Случайный</MenuItem>
                </TextField>
                <TextField
                    label="Время на вопрос, секунд"
                    type="number"
                    value={questionLimit}
                    onChange={(event) => setQuestionLimit(event.target.value)}
                    helperText="Необязательно"
                />
                <Stack gap={1}>
                    <Typography variant="h6">Категории</Typography>
                    {libraries.map((library) => (
                        <FormControlLabel
                            key={library.category.id}
                            control={
                                <Checkbox
                                    checked={categoryIds.includes(library.category.id)}
                                    onChange={() =>
                                        toggle(library.category.id, categoryIds, setCategoryIds)
                                    }
                                />
                            }
                            label={library.category.name}
                        />
                    ))}
                </Stack>
                {selectedLibraries.length > 0 && (
                    <Stack gap={1}>
                        <Typography variant="h6">Темы</Typography>
                        {selectedLibraries
                            .flatMap((library) => library.topics)
                            .map((topic) => (
                                <FormControlLabel
                                    key={topic.id}
                                    control={
                                        <Checkbox
                                            checked={topicIds.includes(topic.id)}
                                            onChange={() => toggle(topic.id, topicIds, setTopicIds)}
                                        />
                                    }
                                    label={topic.name}
                                />
                            ))}
                    </Stack>
                )}
                <Stack gap={1}>
                    <Typography variant="h6">Вопросы</Typography>
                    <Typography color="text.secondary">
                        Выберите вопросы вручную или оставьте список пустым: тогда будут
                        использованы вопросы выбранных категорий и тем.
                    </Typography>
                    {selectableQuestions.map((question) => (
                        <FormControlLabel
                            key={question.id}
                            control={
                                <Checkbox
                                    checked={questionIds.includes(question.id)}
                                    onChange={() =>
                                        toggle(question.id, questionIds, setQuestionIds)
                                    }
                                />
                            }
                            label={question.question}
                        />
                    ))}
                </Stack>
                {(createState.error || updateState.error) && (
                    <Typography color="error">Не удалось сохранить тренировку.</Typography>
                )}
                <Button
                    variant="contained"
                    onClick={submit}
                    disabled={
                        !name.trim() ||
                        (!categoryIds.length && !topicIds.length && !questionIds.length) ||
                        createState.isLoading ||
                        updateState.isLoading
                    }
                >
                    Сохранить
                </Button>
            </Stack>
        </AppShell>
    );
}

export function TrainingDetailsPage({ initialTraining }: { initialTraining: Training }) {
    const router = useRouter();
    const [training, setTraining] = useState(initialTraining);
    const [deleteTraining] = useDeleteTrainingMutation();
    const [restartTraining] = useRestartTrainingMutation();
    const [regenerateTraining] = useRegenerateTrainingMutation();
    const firstActiveQuestion =
        training.questions.find((question) => question.status === 'IN_PROGRESS') ??
        training.questions[0];

    async function restart() {
        setTraining(await restartTraining(training.id).unwrap());
    }
    async function regenerate() {
        setTraining(await regenerateTraining(training.id).unwrap());
    }
    async function remove() {
        await deleteTraining(training.id).unwrap();
        router.replace('/trainings');
    }

    return (
        <AppShell>
            <Stack gap={3}>
                <Typography variant="h3">{training.name}</Typography>
                <Typography color="text.secondary">
                    {training.status === 'COMPLETED' ? 'Пройдена' : 'В работе'} ·{' '}
                    {training.questions.filter((item) => item.status === 'ACCEPTED').length} из{' '}
                    {training.questions.length}
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                    {firstActiveQuestion && training.status !== 'COMPLETED' && (
                        <Button
                            component={Link}
                            href={`/trainings/${training.id}/run?questionId=${firstActiveQuestion.id}`}
                            variant="contained"
                            startIcon={<PlayArrowRoundedIcon />}
                        >
                            Продолжить
                        </Button>
                    )}
                    <Button component={Link} href={`/trainings/${training.id}/edit`}>
                        Редактировать
                    </Button>
                    <Button onClick={restart} startIcon={<ReplayRoundedIcon />}>
                        Начать заново
                    </Button>
                    <Button onClick={regenerate} startIcon={<ShuffleRoundedIcon />}>
                        Перемешать
                    </Button>
                    <Button onClick={remove} color="error" startIcon={<DeleteOutlineRoundedIcon />}>
                        Удалить
                    </Button>
                </Stack>
            </Stack>
        </AppShell>
    );
}
