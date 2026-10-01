import { jsonBody, respond } from '@/server/http';
import { deleteQuestion, updateQuestion } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ categoryId: string; questionId: string }> };

export async function PUT(request: Request, props: Context) {
    const { categoryId, questionId } = await props.params;

    return respond(async () => updateQuestion(categoryId, questionId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const { categoryId, questionId } = await props.params;

    return respond(() => deleteQuestion(categoryId, questionId), 204);
}
