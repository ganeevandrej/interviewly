import { listGroups } from '@/server/library';
import ClientPage from './ClientPage';

export default async function HomePage() {
  const groups = await listGroups();

  return <ClientPage initialGroups={groups} />;
}
