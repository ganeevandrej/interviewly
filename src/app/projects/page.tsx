export const dynamic = 'force-dynamic';

import { listProjects } from '@/server/projects';
import { ProjectListPage } from '@/views/project-list';

export default async function ProjectsPage() {
    const projects = await listProjects();

    return <ProjectListPage initialProjects={projects} />;
}
