import { jsonBody, respond } from '@/server/http';
import { deleteTopic, updateTopic } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ categoryId: string; topicId: string }> };

export async function PUT(request: Request, props: Context) {
    const { categoryId, topicId } = await props.params;

    return respond(async () => updateTopic(categoryId, topicId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const { categoryId, topicId } = await props.params;

    return respond(() => deleteTopic(categoryId, topicId), 204);
}
