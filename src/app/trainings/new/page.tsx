import { listCategories, readCategory } from '@/server/library';
import { TrainingFormPage } from '@/views/training';

export default async function NewTrainingRoute() {
    const categories = await listCategories();
    const libraries = await Promise.all(categories.map((category) => readCategory(category.id)));

    return <TrainingFormPage libraries={libraries} />;
}
