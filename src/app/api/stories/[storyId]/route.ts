import { jsonBody, respond } from '@/server/http';
import { deleteStory, readStory, updateStory } from '@/server/stories';

type Context = { params: Promise<{ storyId: string }> };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => readStory(params.storyId));
}

export async function PUT(request: Request, props: Context) {
    const params = await props.params;
    return respond(async () => updateStory(params.storyId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => deleteStory(params.storyId), 204);
}
