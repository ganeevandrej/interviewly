import { jsonBody, respond } from '@/server/http';
import { deleteProject, readProject, updateProject } from '@/server/projects';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => readProject(params.projectId));
}

export async function PUT(request: Request, props: Context) {
    const params = await props.params;
    return respond(async () => updateProject(params.projectId, await jsonBody(request)));
}

export async function DELETE(_request: Request, props: Context) {
    const params = await props.params;
    return respond(() => deleteProject(params.projectId), 204);
}
