import { useDeleteTopicMutation, useLazyGetTopicDeletionImpactQuery } from '@/entities/topic';
import { EntityDeleteFeature } from '@/features/entity-delete';

import type { Topic } from '@/entities/topic';

type Props = { topic: Topic; questionsCount: number; onDeleted: (topicId: string) => void };

export function ThemeDeleteAdapter({ topic, questionsCount, onDeleted }: Props) {
    const [deleteTopic] = useDeleteTopicMutation();
    const [getDeletionImpact] = useLazyGetTopicDeletionImpactQuery();

    return <EntityDeleteFeature entity={topic} entityName="тему" deleteLabel="Удалить тему" description="Вопросы темы останутся в категории без привязки к теме. Данные связанных тренировок могут измениться." getEntityId={(item) => item.id} getSummary={(item) => ({ title: item.name, meta: `${questionsCount} вопросов`, accentColor: item.accentColor })} getDeletionImpact={(item) => getDeletionImpact({ categoryId: item.categoryId, topicId: item.id }).unwrap()} onDelete={(item) => deleteTopic({ categoryId: item.categoryId, topicId: item.id }).unwrap()} onDeleted={onDeleted} />;
}
