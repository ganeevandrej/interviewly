import { notFound } from 'next/navigation';

import { StoryDetailsPage } from '@/pages/story-details';
import { readStory } from '@/server/stories';
import { InputError } from '@/server/validation';

export default async function StoryPage(props: { params: Promise<{ storyId: string }> }) {
    const params = await props.params;
    if (params.storyId === 'new') return <StoryDetailsPage storyId="new" />;

    let story;
    try {
        story = await readStory(params.storyId);
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }

    return <StoryDetailsPage storyId={params.storyId} initialStory={story} />;
}
