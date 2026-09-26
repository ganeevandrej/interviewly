import { readGroup } from '@/server/library';
import { InputError } from '@/server/validation';
import { notFound } from 'next/navigation';
import ClientPage from './ClientPage';

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  let group;
  try {
    group = await readGroup(params.groupId);
  } catch (error) {
    if (error instanceof InputError && error.status === 404) notFound();
    throw error;
  }

  return <ClientPage initialGroup={group} />;
}
