import { notFound } from 'next/navigation';

import { readGroup } from '@/server/library';
import { InputError } from '@/server/validation';
import { GroupDetailsPage } from '@/views/group-details';

export default async function GroupPage(props: { params: Promise<{ groupId: string }> }) {
    const params = await props.params;
    let group;
    try {
        group = await readGroup(params.groupId);
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }

    return <GroupDetailsPage initialGroup={group} />;
}
