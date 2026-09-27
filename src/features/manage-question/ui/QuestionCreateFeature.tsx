'use client';

import { useCreateQuestionMutation } from '@/entities/question';
import type { Question, QuestionInput } from '@/entities/question';
import type { Topic } from '@/entities/topic';

import { QuestionDialog } from './QuestionDialog';

export function QuestionCreateFeature({
    groupId,
    topics,
    initialTopicId,
    open,
    onClose,
    onCreated,
}: {
    groupId: string;
    topics: Topic[];
    initialTopicId: string | null;
    open: boolean;
    onClose: () => void;
    onCreated: (question: Question) => void;
}) {
    const [createQuestion, state] = useCreateQuestionMutation();

    return (
        <QuestionDialog
            open={open}
            topics={topics}
            initialTopicId={initialTopicId}
            onClose={onClose}
            busy={state.isLoading}
            error={state.error ? 'Не удалось создать вопрос.' : null}
            onSave={(input: QuestionInput) =>
                createQuestion({ groupId, input })
                    .unwrap()
                    .then((question) => {
                        onCreated({ ...question, groupId });
                        onClose();
                    })
            }
        />
    );
}
