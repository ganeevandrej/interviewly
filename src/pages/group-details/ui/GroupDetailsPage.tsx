'use client';

import { GroupDetailsContent } from '@/widgets/group-details';
import { AppShell } from '@/widgets/app-shell';

export default function GroupDetailsPage(
    props: Omit<React.ComponentProps<typeof GroupDetailsContent>, 'shell'>,
) {
    return (
        <GroupDetailsContent
            {...props}
            shell={(children, onCreate) => <AppShell onCreate={onCreate}>{children}</AppShell>}
        />
    );
}
