import { notFound } from 'next/navigation';

import { readCategory } from '@/server/library';
import { InputError } from '@/server/validation';
import { CategoryDetailsPage } from '@/views/category-details';

export default async function CategoryRoute(props: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await props.params;

    try {
        return <CategoryDetailsPage initialLibrary={await readCategory(categoryId)} />;
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
