import { readStory } from '@/server/stories';
import { InputError } from '@/server/validation';
import { notFound } from 'next/navigation';
import ClientPage from './ClientPage';

export default async function StoryPage({ params }: { params: { storyId: string } }) {
  if (params.storyId === 'new') return <ClientPage />;

  let story;
  try {
    story = await readStory(params.storyId);
  } catch (error) {
    if (error instanceof InputError && error.status === 404) notFound();
    throw error;
  }

  return <ClientPage initialStory={story} />;
}
