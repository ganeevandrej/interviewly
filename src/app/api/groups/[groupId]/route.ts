import { readGroup, updateGroup, deleteGroup } from '@/server/library';
import { respond, jsonBody } from '@/server/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: { groupId: string } };

export function GET(_request: Request, { params }: Context) {
  return respond(() => readGroup(params.groupId));
}
export function PUT(request: Request, { params }: Context) {
  return respond(async () => updateGroup(params.groupId, await jsonBody(request)));
}
export function DELETE(_request: Request, { params }: Context) {
  return respond(() => deleteGroup(params.groupId), 204);
}
