import { useDeleteQuestionMutation } from '@/entities/question';
import { EntityDeleteFeature } from '@/features/entity-delete';

import type { Question } from '@/entities/question';

type Props = {
    question: Question;
    onDeleted: (questionId: string) => void;
};

export function QuestionDeleteAdapter({ question, onDeleted }: Props) {
    const [deleteQuestion] = useDeleteQuestionMutation();

    return (
        <EntityDeleteFeature
            entity={question}
            entityName="вопрос"
            deleteLabel="Удалить вопрос"
            description="Вопрос будет удалён из категории и всех связанных тем."
            getEntityId={(item) => item.id}
            getSummary={(item) => ({ title: item.question, meta: 'Вопрос' })}
            getDeletionImpact={async () => ({ trainingCount: 0, trainings: [] })}
            onDelete={(item) =>
                deleteQuestion({ categoryId: item.categoryId, questionId: item.id }).unwrap()
            }
            onDeleted={onDeleted}
        />
    );
}
