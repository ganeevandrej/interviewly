import { updateQuestion, deleteQuestion } from '@/server/library';
import { respond, jsonBody } from '@/server/http';

type Context = { params: { groupId: string; questionId: string } };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function PUT(request: Request, { params }: Context) {
  return respond(async () =>
    updateQuestion(params.groupId, params.questionId, await jsonBody(request)),
  );
}

export function DELETE(_request: Request, { params }: Context) {
  return respond(() => deleteQuestion(params.groupId, params.questionId), 204);
}
