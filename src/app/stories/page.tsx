import { StoryListPage } from '@/pages/story-list';
import { listStories } from '@/server/stories';

export default async function StoriesPage() {
    const stories = await listStories();

    return <StoryListPage initialStories={stories} />;
}
