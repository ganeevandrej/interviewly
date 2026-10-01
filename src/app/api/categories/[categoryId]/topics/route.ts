import { jsonBody, respond } from '@/server/http';
import { createTopic } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    props: { params: Promise<{ categoryId: string }> },
) {
    const { categoryId } = await props.params;

    return respond(async () => createTopic(categoryId, await jsonBody(request)), 201);
}
