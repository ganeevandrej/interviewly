import { EntityCreateDialog } from '@/features/entity-create';
import { useCreateTopicMutation } from '@/entities/topic';

import type { Topic } from '@/entities/topic';

type Props = {
    categoryId: string;
    open: boolean;
    onClose: () => void;
    onCreated: (topic: Topic) => void;
};

export function ThemeCreateAdapter({ categoryId, open, onClose, onCreated }: Props) {
    const [createTopic] = useCreateTopicMutation();

    return (
        <EntityCreateDialog
            open={open}
            title="Создать тему"
            description="Добавьте название темы и выберите цветовой акцент."
            nameLabel="Название темы"
            colorLabel="Цвет темы"
            submitLabel="Создать тему"
            onClose={onClose}
            onSubmit={async ({ name, color }) => {
                const topic = await createTopic({ categoryId, name, accentColor: color }).unwrap();
                onCreated(topic);
            }}
        />
    );
}
