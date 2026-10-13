import { EntityCreateDialog } from '@/features/entity-create';
import { useUpdateTopicMutation } from '@/entities/topic';

import type { Topic } from '@/entities/topic';

type Props = {
    topic: Topic;
    open: boolean;
    onClose: () => void;
    onUpdated: (topic: Topic) => void;
};

export function ThemeEditAdapter({ topic, open, onClose, onUpdated }: Props) {
    const [updateTopic] = useUpdateTopicMutation();

    return (
        <EntityCreateDialog
            open={open}
            title="Редактировать тему"
            description="Измените название темы и её цветовой акцент."
            nameLabel="Название темы"
            colorLabel="Цвет темы"
            submitLabel="Сохранить"
            initialValues={{ name: topic.name, color: topic.accentColor }}
            onClose={onClose}
            onSubmit={async ({ name, color }) => {
                const updated = await updateTopic({
                    categoryId: topic.categoryId,
                    topicId: topic.id,
                    name,
                    accentColor: color,
                }).unwrap();
                onUpdated(updated);
            }}
        />
    );
}
