import { HomePage as HomePageView } from '@/pages/home';
import { listGroups } from '@/server/library';

export default async function HomePage() {
    const groups = await listGroups();

    return <HomePageView initialGroups={groups} />;
}
