import { respond, jsonBody } from '@/server/http';
import { readGroup, updateGroup, deleteGroup } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ groupId: string }> };

export async function GET(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => readGroup(params.groupId));
}

export async function PUT(request: Request, props: Context) {
    const params = await props.params;
    return respond(async () => updateGroup(params.groupId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => deleteGroup(params.groupId), 204);
}
