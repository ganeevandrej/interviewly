import { notFound } from 'next/navigation';

import { prepareProjectFocus } from '@/server/projects';
import { InputError } from '@/server/validation';
import { LibraryFocusPage } from '@/views/library-focus';

export default async function ProjectFocusRoute(props: {
    params: Promise<{ projectId: string; questionId: string }>;
}) {
    const { projectId, questionId } = await props.params;
    try {
        const focus = await prepareProjectFocus(projectId, questionId);
        return (
            <LibraryFocusPage
                title="Проект"
                backHref={`/projects/${projectId}`}
                questions={focus.questions}
                questionId={focus.questionId}
                focusHref={(id) => `/projects/${projectId}/focus/${id}`}
            />
        );
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
