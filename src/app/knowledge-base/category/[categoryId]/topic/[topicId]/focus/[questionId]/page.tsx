import { notFound } from 'next/navigation';

import { prepareTopicFocus } from '@/server/library';
import { InputError } from '@/server/validation';
import { LibraryFocusPage } from '@/views/library-focus';

export default async function TopicFocusRoute(props: {
    params: Promise<{ categoryId: string; topicId: string; questionId: string }>;
}) {
    const { categoryId, topicId, questionId } = await props.params;
    try {
        const focus = await prepareTopicFocus(categoryId, topicId, questionId);
        return (
            <LibraryFocusPage
                title="Тема"
                backHref={`/knowledge-base/category/${categoryId}/topic/${topicId}`}
                questions={focus.questions}
                questionId={focus.questionId}
                focusHref={(id) =>
                    `/knowledge-base/category/${categoryId}/topic/${topicId}/focus/${id}`
                }
            />
        );
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
