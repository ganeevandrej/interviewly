import { respond, jsonBody } from '@/server/http';
import { createTopic } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request, props: { params: Promise<{ groupId: string }> }) {
    const params = await props.params;
    return respond(async () => createTopic(params.groupId, await jsonBody(request)), 201);
}
