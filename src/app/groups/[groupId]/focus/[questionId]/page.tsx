import { notFound } from 'next/navigation';

import { readGroup } from '@/server/library';
import { InputError } from '@/server/validation';
import { QuestionFocusPage } from '@/views/question-focus';

export default async function FocusPage(
    props: {
        params: Promise<{ groupId: string; questionId: string }>;
    }
) {
    const params = await props.params;
    let group;
    try {
        group = await readGroup(params.groupId);
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }

    return <QuestionFocusPage initialGroup={group} questionId={params.questionId} />;
}
