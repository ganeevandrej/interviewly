import { respond, jsonBody } from '@/server/http';
import { updateTopic, deleteTopic } from '@/server/library';

type Context = { params: Promise<{ groupId: string; topicId: string }> };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, props: Context) {
    const params = await props.params;
    return respond(async () =>
        updateTopic(params.groupId, params.topicId, await jsonBody(request)),
    );
}

export async function DELETE(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => deleteTopic(params.groupId, params.topicId), 204);
}
