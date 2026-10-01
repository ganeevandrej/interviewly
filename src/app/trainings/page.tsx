export const dynamic = 'force-dynamic';

import { listTrainings } from '@/server/trainings';
import { TrainingListPage } from '@/views/training';

export default async function TrainingsRoute() {
    return <TrainingListPage trainings={await listTrainings()} />;
}
