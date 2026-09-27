'use client';

import { StoryEditor } from '@/features/story-edit';
import { AppShell } from '@/widgets/app-shell';

export default function StoryDetailsPage(props: React.ComponentProps<typeof StoryEditor>) {
    return (
        <AppShell>
            <StoryEditor {...props} />
        </AppShell>
    );
}
