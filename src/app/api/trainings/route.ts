import { jsonBody, respond } from '@/server/http';
import { createTraining, listTrainings } from '@/server/trainings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
    return respond(listTrainings);
}

export function POST(request: Request) {
    return respond(async () => createTraining(await jsonBody(request)), 201);
}
