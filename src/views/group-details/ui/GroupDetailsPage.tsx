'use client';

import { AppShell } from '@/widgets/app-shell';
import { GroupDetailsContent } from '@/widgets/group-details';

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
