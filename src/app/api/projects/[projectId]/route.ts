import { deleteProject, readProject, updateProject } from '@/server/projects';
import { jsonBody, respond } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: { projectId: string } };

export function GET(_request: Request, { params }: Context) {
  return respond(() => readProject(params.projectId));
}

export function PUT(request: Request, { params }: Context) {
  return respond(async () => updateProject(params.projectId, await jsonBody(request)));
}

export function DELETE(_request: Request, { params }: Context) {
  return respond(() => deleteProject(params.projectId), 204);
}
