import { listStories } from '@/server/stories';
import { StoryListPage } from '@/views/story-list';

export default async function StoriesPage() {
    const stories = await listStories();

    return <StoryListPage initialStories={stories} />;
}
