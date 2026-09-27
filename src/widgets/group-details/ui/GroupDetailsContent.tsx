'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import type { Question } from '@/entities/question';
import type { QuestionGroup } from '@/entities/group';
import type { LibraryData, LibraryGroup } from '@/shared/types/library';

import { GroupHeader } from './GroupHeader';
import { QuestionTopics } from './QuestionTopics';

export function GroupDetailsContent({
    initialGroup,
    shell,
}: {
    initialGroup: LibraryGroup;
    shell: (children: React.ReactNode, onCreate: () => void) => React.ReactNode;
}) {
    const [data, setData] = useState<LibraryData>(() => ({
        groups: [initialGroup],
        topics: initialGroup.topics,
        questions: initialGroup.topics.flatMap((topic) =>
            topic.questions.map((question) => ({ ...question, groupId: initialGroup.id })),
        ),
    }));
    const [createRequest, setCreateRequest] = useState(0);
    const group = data.groups.find((item) => item.id === initialGroup.id);
    const topics = data.topics.filter((topic) => topic.groupId === initialGroup.id);
    const questions = data.questions.filter((question) => question.groupId === initialGroup.id);

    if (!group) {
        return shell(
            <Stack gap={2}>
                <Typography variant="h4">Группа не найдена</Typography>
                <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
                    Вернуться на главную
                </Button>
            </Stack>,
            () => undefined,
        );
    }

    function updateGroup(updated: QuestionGroup) {
        setData((current) => ({ ...current, groups: [updated] }));
    }

    function updateQuestions(updatedQuestions: Question[]) {
        setData((current) => ({
            ...current,
            questions: [
                ...current.questions.filter((question) => question.groupId !== initialGroup.id),
                ...updatedQuestions,
            ],
        }));
    }

    return shell(
        <Stack gap={3}>
            <Button
                component={Link}
                href="/"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{ alignSelf: 'start' }}
            >
                Мои группы
            </Button>
            <GroupHeader group={group} questionCount={questions.length} onSaved={updateGroup} />
            <QuestionTopics
                groupId={group.id}
                topics={topics}
                questions={questions}
                createRequest={createRequest}
                onQuestionsChange={updateQuestions}
            />
        </Stack>,
        () => setCreateRequest((current) => current + 1),
    );
}
