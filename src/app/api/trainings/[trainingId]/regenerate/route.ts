import { respond } from '@/server/http';
import { regenerateTraining } from '@/server/trainings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_request: Request, props: { params: Promise<{ trainingId: string }> }) {
    const { trainingId } = await props.params;
    return respond(() => regenerateTraining(trainingId));
}
