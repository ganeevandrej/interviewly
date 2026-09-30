import { listCategories } from '@/server/library';
import { KnowledgeBasePage } from '@/views/knowledge-base';

export default async function KnowledgeBaseRoute() {
    const categories = await listCategories();

    return <KnowledgeBasePage initialCategories={categories} />;
}
