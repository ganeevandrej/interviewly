import { readGroup } from '@/server/library';
import { InputError } from '@/server/validation';
import { notFound } from 'next/navigation';
import { QuestionFocusPage } from '@/pages/question-focus';

export default async function FocusPage({
    params,
}: {
    params: { groupId: string; questionId: string };
}) {
    let group;
    try {
        group = await readGroup(params.groupId);
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }

    return <QuestionFocusPage initialGroup={group} questionId={params.questionId} />;
}
