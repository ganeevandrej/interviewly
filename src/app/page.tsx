import { listGroups } from '@/server/library';
import { HomePage as HomePageView } from '@/views/home';

export default async function HomePage() {
    const groups = await listGroups();

    return <HomePageView initialGroups={groups} />;
}
