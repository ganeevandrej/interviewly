import { updateTopic, deleteTopic } from '@/server/library';
import { respond, jsonBody } from '@/server/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: { groupId: string; topicId: string } };

export function PUT(request: Request, { params }: Context) {
  return respond(async () => updateTopic(params.groupId, params.topicId, await jsonBody(request)));
}

export function DELETE(_request: Request, { params }: Context) {
  return respond(() => deleteTopic(params.groupId, params.topicId), 204);
}
