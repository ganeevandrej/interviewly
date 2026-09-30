import { notFound } from 'next/navigation';

import { prepareCategoryFocus } from '@/server/library';
import { InputError } from '@/server/validation';
import { LibraryFocusPage } from '@/views/library-focus';

export default async function CategoryFocusRoute(props: {
    params: Promise<{ categoryId: string; questionId: string }>;
}) {
    const { categoryId, questionId } = await props.params;
    try {
        const focus = await prepareCategoryFocus(categoryId, questionId);
        return (
            <LibraryFocusPage
                title="Категория"
                backHref={`/knowledge-base/category/${categoryId}`}
                questions={focus.questions}
                questionId={focus.questionId}
                focusHref={(id) => `/knowledge-base/category/${categoryId}/focus/${id}`}
            />
        );
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }
}
