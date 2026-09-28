import { jsonBody, respond } from '@/server/http';
import { addProjectQuestion } from '@/server/projects';
import { InputError } from '@/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request, props: { params: Promise<{ projectId: string }> }) {
    const params = await props.params;
    return respond(async () => {
        const body = await jsonBody(request);

        if (!body || typeof body !== 'object' || Array.isArray(body) || !('questionId' in body))
            throw new InputError('Поле «Вопрос» обязательно.');

        return addProjectQuestion(
            params.projectId,
            String((body as { questionId: unknown }).questionId),
        );
    }, 201);
}
