import { createQuestion } from '@/server/library';
import { respond, jsonBody } from '@/server/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function POST(request: Request, { params }: { params: { groupId: string } }) {
  return respond(async () => createQuestion(params.groupId, await jsonBody(request)), 201);
}
