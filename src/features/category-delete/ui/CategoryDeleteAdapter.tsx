import {
    useDeleteCategoryMutation,
    useLazyGetCategoryDeletionImpactQuery,
} from '@/entities/category';
import { EntityDeleteFeature } from '@/features/entity-delete';

import type { CategorySummary } from '@/entities/category';

type Props = { category: CategorySummary; onDeleted: (categoryId: string) => void };

export function CategoryDeleteAdapter({ category, onDeleted }: Props) {
    const [deleteCategory] = useDeleteCategoryMutation();
    const [getDeletionImpact] = useLazyGetCategoryDeletionImpactQuery();

    return (
        <EntityDeleteFeature
            entity={category}
            entityName="категорию"
            deleteLabel="Удалить категорию"
            description="Вместе с категорией будут удалены все её темы и вопросы. Данные связанных тренировок могут измениться."
            getEntityId={(item) => item.id}
            getSummary={(item) => ({
                title: item.name,
                meta: `${item.topicsCount} тем · ${item.questionsCount} вопросов`,
                accentColor: item.accentColor,
            })}
            getDeletionImpact={async (item) => getDeletionImpact(item.id).unwrap()}
            onDelete={(item) => deleteCategory(item.id).unwrap()}
            onDeleted={onDeleted}
        />
    );
}
