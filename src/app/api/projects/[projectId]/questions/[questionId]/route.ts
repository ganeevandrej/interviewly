import { removeProjectQuestion } from '@/server/projects';
import { respond } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function DELETE(
  _request: Request,
  { params }: { params: { projectId: string; questionId: string } },
) {
  return respond(() => removeProjectQuestion(params.projectId, params.questionId), 204);
}
