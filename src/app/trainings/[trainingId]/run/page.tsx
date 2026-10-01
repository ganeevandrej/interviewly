import { notFound } from 'next/navigation';

import { readTraining } from '@/server/trainings';
import { InputError } from '@/server/validation';
import { TrainingRunPage } from '@/views/training-run';

export default async function TrainingRunRoute(props: { params: Promise<{ trainingId: string }> }) {
    try {
        const { trainingId } = await props.params;
        return <TrainingRunPage initialTraining={await readTraining(trainingId)} />;
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
