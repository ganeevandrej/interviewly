'use client';

import { useCreateQuestionMutation } from '@/entities/question';
import type { Question, QuestionInput } from '@/entities/question';
import type { Topic } from '@/entities/topic';

type QuestionDialogProps = {
    open: boolean;
    topics: Topic[];
    initialTopicId?: string | null;
    onClose: () => void;
    onSave: (payload: QuestionInput) => Promise<void>;
    busy?: boolean;
    error?: string | null;
};

export function QuestionCreateFeature({
    groupId,
    topics,
    initialTopicId,
    open,
    onClose,
    onCreated,
    dialog: Dialog,
}: {
    groupId: string;
    topics: Topic[];
    initialTopicId: string | null;
    open: boolean;
    onClose: () => void;
    onCreated: (question: Question) => void;
    dialog: (props: QuestionDialogProps) => React.ReactNode;
}) {
    const [createQuestion, state] = useCreateQuestionMutation();

    return Dialog({
        open,
        topics,
        initialTopicId,
        onClose,
        busy: state.isLoading,
        error: state.error ? 'Не удалось создать вопрос.' : null,
        onSave: (input: QuestionInput) =>
            createQuestion({ groupId, input })
                .unwrap()
                .then((question) => {
                    onCreated({ ...question, groupId });
                    onClose();
                }),
    });
}
