import { notFound } from 'next/navigation';

import { readCategoryContent, readCategoryDetails } from '@/server/library';
import { InputError } from '@/server/validation';
import { CategoryDetailsPage } from '@/views/category-details';

export default async function CategoryRoute(props: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await props.params;

    try {
        const category = await readCategoryDetails(categoryId);

        try {
            const content = await readCategoryContent(categoryId);

            return <CategoryDetailsPage initialLibrary={{ category, ...content }} />;
        } catch {
            return <CategoryDetailsPage initialCategory={category} hasContentError />;
        }
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();

        return <CategoryDetailsPage hasContentError />;
    }
}
