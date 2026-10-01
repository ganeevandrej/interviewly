import { notFound } from 'next/navigation';

import { listCategories, readCategory } from '@/server/library';
import { readTraining } from '@/server/trainings';
import { InputError } from '@/server/validation';
import { TrainingFormPage } from '@/views/training';

export default async function EditTrainingRoute(props: {
    params: Promise<{ trainingId: string }>;
}) {
    try {
        const [{ trainingId }, categories] = await Promise.all([props.params, listCategories()]);
        const [training, libraries] = await Promise.all([
            readTraining(trainingId),
            Promise.all(categories.map((category) => readCategory(category.id))),
        ]);

        return <TrainingFormPage libraries={libraries} training={training} />;
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
