import { respond } from '@/server/http';
import { getTopicDeletionImpact } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ categoryId: string; topicId: string }> };

export async function GET(_request: Request, props: Context) {
    const { categoryId, topicId } = await props.params;

    return respond(() => getTopicDeletionImpact(categoryId, topicId));
}
