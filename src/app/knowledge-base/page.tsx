export const dynamic = 'force-dynamic';

import { listCategories } from '@/server/library';
import { KnowledgeBasePage } from '@/views/knowledge-base';

export default async function KnowledgeBaseRoute() {
    try {
        const categories = await listCategories();

        return <KnowledgeBasePage initialCategories={categories} />;
    } catch {
        return <KnowledgeBasePage initialCategories={[]} hasLoadError />;
    }
}
