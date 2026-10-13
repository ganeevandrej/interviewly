'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CategoryEditAdapter } from '@/features/category-edit';
import { QuestionUpsertDialog } from '@/features/question-upsert';
import { ThemeCreateAdapter } from '@/features/theme-create';
import { ThemeEditAdapter } from '@/features/theme-edit';
import { categoryDetailsText } from '@/views/category-details/constants/categoryDetailsText';
import {
    questionFromLibrary,
    updateLibraryQuestion,
} from '@/views/category-details/model/categoryDetailsModel';
import { CategoryDetailsError } from '@/views/category-details/ui/CategoryDetailsError';
import { CategoryDetailsHeader } from '@/views/category-details/ui/CategoryDetailsHeader';
import { CategoryQuestionsSection } from '@/views/category-details/ui/CategoryQuestionsSection';
import { CategoryTopicsSection } from '@/views/category-details/ui/CategoryTopicsSection';
import { AppShell } from '@/widgets/app-shell';

import type { CategoryLibrary } from '@/entities/category';
import type { QuestionDraft } from '@/entities/question';

export default function CategoryDetailsPage({
    initialLibrary,
    initialCategory,
    hasContentError = false,
}: {
    initialLibrary?: CategoryLibrary;
    initialCategory?: CategoryLibrary['category'];
    hasContentError?: boolean;
}) {
    const router = useRouter();
    const [library, setLibrary] = useState(
        initialLibrary ?? {
            category: initialCategory ?? { id: '', name: '', accentColor: '#70DECF' },
            topics: [],
            questions: [],
            categoryQuestions: [],
            topicQuestions: [],
        },
    );
    const [editingCategory, setEditingCategory] = useState(false);
    const [creatingTopic, setCreatingTopic] = useState(false);
    const [editingTopicId, setEditingTopicId] = useState<string>();
    const [draft, setDraft] = useState<QuestionDraft>();

    if (hasContentError) {
        return (
            <AppShell>
                <CategoryDetailsError
                    categoryName={initialCategory?.name}
                    onRetry={() => router.refresh()}
                />
            </AppShell>
        );
    }

    const questions = questionFromLibrary(library);

    async function removeTopic(id: string) {
        setLibrary((current) => ({
            ...current,
            topics: current.topics.filter((item) => item.id !== id),
            topicQuestions: current.topicQuestions.filter((link) => link.topicId !== id),
        }));
    }

    function removeQuestion(questionId: string) {
        setLibrary((current) => ({
            ...current,
            questions: current.questions.filter((item) => item.id !== questionId),
            categoryQuestions: current.categoryQuestions.filter(
                (item) => item.questionId !== questionId,
            ),
            topicQuestions: current.topicQuestions.filter((item) => item.questionId !== questionId),
        }));
    }

    const visibleQuestions = questions.filter((item) => !item.topicId);
    const newQuestion = () => setDraft({ question: '', answer: '', topicId: null });

    return (
        <AppShell>
            <Stack gap={3}>
                <Stack direction="row" gap={1} alignItems="center">
                    <Typography
                        component={Link}
                        href="/knowledge-base"
                        color="primary"
                        variant="body2"
                        sx={{ textDecoration: 'none' }}
                    >
                        {categoryDetailsText.breadcrumbs.knowledgeBase}
                    </Typography>
                    <Typography color="text.disabled">
                        {categoryDetailsText.breadcrumbs.separator}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {library.category.name}
                    </Typography>
                </Stack>
                <CategoryDetailsHeader
                    name={library.category.name}
                    accentColor={library.category.accentColor}
                    onEdit={() => setEditingCategory(true)}
                />
                <CategoryTopicsSection
                    categoryId={library.category.id}
                    topics={library.topics}
                    topicQuestions={library.topicQuestions}
                    onCreate={() => setCreatingTopic(true)}
                    onEdit={setEditingTopicId}
                    onDeleted={removeTopic}
                />
                <CategoryQuestionsSection
                    categoryId={library.category.id}
                    questions={visibleQuestions}
                    onCreate={newQuestion}
                    onEdit={setDraft}
                    onDeleted={removeQuestion}
                />
            </Stack>
            <CategoryEditAdapter
                category={library.category}
                open={editingCategory}
                onClose={() => setEditingCategory(false)}
                onUpdated={(category) => {
                    setLibrary((current) => ({ ...current, category }));
                    setEditingCategory(false);
                }}
            />
            <ThemeCreateAdapter
                categoryId={library.category.id}
                open={creatingTopic}
                onClose={() => setCreatingTopic(false)}
                onCreated={(topic) => {
                    setLibrary((current) => ({ ...current, topics: [...current.topics, topic] }));
                    setCreatingTopic(false);
                }}
            />
            {editingTopicId && (
                <ThemeEditAdapter
                    topic={library.topics.find((item) => item.id === editingTopicId)!}
                    open
                    onClose={() => setEditingTopicId(undefined)}
                    onUpdated={(topic) => {
                        setLibrary((current) => ({
                            ...current,
                            topics: current.topics.map((item) =>
                                item.id === topic.id ? topic : item,
                            ),
                        }));
                        setEditingTopicId(undefined);
                    }}
                />
            )}
            <QuestionUpsertDialog
                categoryId={library.category.id}
                open={Boolean(draft)}
                draft={draft}
                topics={library.topics}
                onClose={() => setDraft(undefined)}
                onSaved={(question) => {
                    setLibrary((current) => updateLibraryQuestion(current, question));
                }}
                onChange={setDraft}
            />
        </AppShell>
    );
}
