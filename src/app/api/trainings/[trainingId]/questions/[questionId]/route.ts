import { jsonBody, respond } from '@/server/http';
import { updateTrainingQuestion } from '@/server/trainings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ trainingId: string; questionId: string }> };

export async function PUT(request: Request, props: Context) {
    const { trainingId, questionId } = await props.params;
    return respond(async () =>
        updateTrainingQuestion(trainingId, questionId, await jsonBody(request)),
    );
}
