import { notFound } from 'next/navigation';

import { readCategory } from '@/server/library';
import { InputError } from '@/server/validation';
import { TopicDetailsPage } from '@/views/topic-details';

export default async function TopicRoute(props: {
    params: Promise<{ categoryId: string; topicId: string }>;
}) {
    const { categoryId, topicId } = await props.params;

    try {
        return (
            <TopicDetailsPage initialLibrary={await readCategory(categoryId)} topicId={topicId} />
        );
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
