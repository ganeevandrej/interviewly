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
            getEntityId={(item) => item.id}
            getDeletionImpact={async (item) => ({
                trainingCount: (await getDeletionImpact(item.id).unwrap()).trainingCount,
            })}
            onDelete={(item) => deleteCategory(item.id).unwrap()}
            onDeleted={onDeleted}
        />
    );
}
