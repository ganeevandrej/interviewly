import { respond, jsonBody } from '@/server/http';
import { updateQuestion, deleteQuestion } from '@/server/library';

type Context = { params: Promise<{ groupId: string; questionId: string }> };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, props: Context) {
    const params = await props.params;
    return respond(async () =>
        updateQuestion(params.groupId, params.questionId, await jsonBody(request)),
    );
}

export async function DELETE(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => deleteQuestion(params.groupId, params.questionId), 204);
}
