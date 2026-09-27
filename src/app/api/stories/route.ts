import { jsonBody, respond } from '@/server/http';
import { createStory, listStories } from '@/server/stories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
    return respond(listStories);
}

export function POST(request: Request) {
    return respond(async () => createStory(await jsonBody(request)), 201);
}
