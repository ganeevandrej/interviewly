import { deleteStory, readStory, updateStory } from '@/server/stories';
import { jsonBody, respond } from '@/server/http';

type Context = { params: { storyId: string } };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(_request: Request, { params }: Context) {
  return respond(() => readStory(params.storyId));
}

export function PUT(request: Request, { params }: Context) {
  return respond(async () => updateStory(params.storyId, await jsonBody(request)));
}

export function DELETE(_request: Request, { params }: Context) {
  return respond(() => deleteStory(params.storyId), 204);
}
