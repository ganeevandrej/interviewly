export const dynamic = 'force-dynamic';

import { listTrainings } from '@/server/trainings';
import { HomePage } from '@/views/dashboard';

export default async function HomeRoute() {
    const trainings = await listTrainings();

    return <HomePage trainings={trainings} />;
}
