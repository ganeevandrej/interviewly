'use client';

import { AppShell } from '@/widgets/app-shell';
import { StoryEditor } from '@/features/story-edit';

export default function StoryDetailsPage(props: React.ComponentProps<typeof StoryEditor>) {
    return (
        <AppShell>
            <StoryEditor {...props} />
        </AppShell>
    );
}
