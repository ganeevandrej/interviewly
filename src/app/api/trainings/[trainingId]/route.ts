import { jsonBody, respond } from '@/server/http';
import { deleteTraining, readTraining, updateTraining } from '@/server/trainings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ trainingId: string }> };

export async function GET(_request: Request, props: Context) {
    const { trainingId } = await props.params;
    return respond(() => readTraining(trainingId));
}

export async function PUT(request: Request, props: Context) {
    const { trainingId } = await props.params;
    return respond(async () => updateTraining(trainingId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const { trainingId } = await props.params;
    return respond(() => deleteTraining(trainingId), 204);
}
