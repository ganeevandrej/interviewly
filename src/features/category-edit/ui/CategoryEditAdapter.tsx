import { useUpdateCategoryMutation } from '@/entities/category';
import { EntityCreateDialog } from '@/features/entity-create';

import type { Category } from '@/entities/category';

type Props = { category: Category; open: boolean; onClose: () => void; onUpdated: (category: Category) => void };

export function CategoryEditAdapter({ category, open, onClose, onUpdated }: Props) {
    const [updateCategory] = useUpdateCategoryMutation();

    return <EntityCreateDialog open={open} title="Редактировать категорию" description="Измените название и цветовой акцент категории." nameLabel="Название категории" colorLabel="Цвет категории" submitLabel="Сохранить" initialValues={{ name: category.name, color: category.accentColor }} onClose={onClose} onSubmit={async ({ name, color }) => {
        const updated = await updateCategory({ id: category.id, input: { name, accentColor: color } }).unwrap();
        onUpdated(updated);
    }} />;
}
