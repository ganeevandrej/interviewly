import { respond, jsonBody } from '@/server/http';
import { listGroups, createGroup } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
    return respond(listGroups);
}

export function POST(request: Request) {
    return respond(async () => createGroup(await jsonBody(request)), 201);
}
