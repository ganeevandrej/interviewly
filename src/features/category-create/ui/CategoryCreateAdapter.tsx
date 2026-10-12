import { useCreateCategoryMutation } from '@/entities/category';
import { EntityCreateDialog } from '@/features/entity-create';

import { categoryCreateText } from '../constants/categoryCreateText';

import type { Category } from '@/entities/category';

type Props = { open: boolean; onClose: () => void; onCreated: (category: Category) => void };

export function CategoryCreateAdapter({ open, onClose, onCreated }: Props) {
    const [createCategory] = useCreateCategoryMutation();

    return (
        <EntityCreateDialog
            open={open}
            title={categoryCreateText.title}
            description={categoryCreateText.description}
            nameLabel={categoryCreateText.nameLabel}
            colorLabel={categoryCreateText.colorLabel}
            submitLabel={categoryCreateText.create}
            onClose={onClose}
            onSubmit={async ({ name, color }) => {
                const category = await createCategory({ name, accentColor: color }).unwrap();
                onCreated(category);
            }}
        />
    );
}
