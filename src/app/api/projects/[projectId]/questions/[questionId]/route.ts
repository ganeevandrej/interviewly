import { respond } from '@/server/http';
import { removeProjectQuestion } from '@/server/projects';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
    _request: Request,
    props: { params: Promise<{ projectId: string; questionId: string }> }
) {
    const params = await props.params;
    return respond(() => removeProjectQuestion(params.projectId, params.questionId), 204);
}
