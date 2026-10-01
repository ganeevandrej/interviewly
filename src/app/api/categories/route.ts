import { jsonBody, respond } from '@/server/http';
import { createCategory, listCategories } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
    return respond(listCategories);
}

export function POST(request: Request) {
    return respond(async () => createCategory(await jsonBody(request)), 201);
}
