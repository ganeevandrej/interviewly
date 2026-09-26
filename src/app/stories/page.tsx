import { listStories } from '@/server/stories';
import ClientPage from './ClientPage';

export default async function StoriesPage() {
  const stories = await listStories();

  return <ClientPage initialStories={stories} />;
}
