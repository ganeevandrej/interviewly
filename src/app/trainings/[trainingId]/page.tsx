import { notFound } from 'next/navigation';

import { readTraining } from '@/server/trainings';
import { InputError } from '@/server/validation';
import { TrainingDetailsPage } from '@/views/training';

export default async function TrainingRoute(props: { params: Promise<{ trainingId: string }> }) {
    try {
        const { trainingId } = await props.params;
        return <TrainingDetailsPage initialTraining={await readTraining(trainingId)} />;
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
