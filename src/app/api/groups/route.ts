import { listGroups, createGroup } from '@/server/library';
import { respond, jsonBody } from '@/server/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET() {
  return respond(listGroups);
}
export function POST(request: Request) {
  return respond(async () => createGroup(await jsonBody(request)), 201);
}
