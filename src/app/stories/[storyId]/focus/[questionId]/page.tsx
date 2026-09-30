import { notFound } from 'next/navigation';

import { prepareStoryFocus } from '@/server/stories';
import { InputError } from '@/server/validation';
import { LibraryFocusPage } from '@/views/library-focus';

export default async function StoryFocusRoute(props: {
    params: Promise<{ storyId: string; questionId: string }>;
}) {
    const { storyId, questionId } = await props.params;
    try {
        const focus = await prepareStoryFocus(storyId, questionId);
        return (
            <LibraryFocusPage
                title="История"
                backHref={`/stories/${storyId}`}
                questions={focus.questions}
                questionId={focus.questionId}
                focusHref={(id) => `/stories/${storyId}/focus/${id}`}
            />
        );
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
