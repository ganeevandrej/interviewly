import { createProject, listProjects } from '@/server/projects';
import { jsonBody, respond } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() { return respond(listProjects); }

export function POST(request: Request) { return respond(async () => createProject(await jsonBody(request)), 201); }
