import { respond, jsonBody } from '@/server/http';
import { createQuestion } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request, props: { params: Promise<{ groupId: string }> }) {
    const params = await props.params;
    return respond(async () => createQuestion(params.groupId, await jsonBody(request)), 201);
}
