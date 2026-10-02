import { respond } from '@/server/http';
import { getCategoryDeletionImpact } from '@/server/library';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ categoryId: string }> };

export async function GET(_request: Request, props: Context) {
    const { categoryId } = await props.params;

    return respond(() => getCategoryDeletionImpact(categoryId));
}
