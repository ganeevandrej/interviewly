'use client';

import { useState } from 'react';

import { useUpdateQuestionMutation } from '@/entities/question';
import type { Question, QuestionInput } from '@/entities/question';
import type { Topic } from '@/entities/topic';

import { QuestionDialog } from './QuestionDialog';

export function QuestionEditFeature({
    groupId,
    question,
    topics,
    onUpdated,
    onClose,
}: {
    groupId: string;
    question?: Question;
    topics: Topic[];
    onUpdated: (question: Question) => void;
    onClose: () => void;
}) {
    const [updateQuestion, state] = useUpdateQuestionMutation();

    return (
        <QuestionDialog
            open={Boolean(question)}
            question={question}
            topics={topics}
            onClose={onClose}
            busy={state.isLoading}
            error={state.error ? 'Не удалось сохранить вопрос.' : null}
            onSave={(input: QuestionInput) => {
                if (!question) return Promise.resolve();
                return updateQuestion({ groupId, questionId: question.id, input })
                    .unwrap()
                    .then(onUpdated);
            }}
        />
    );
}
