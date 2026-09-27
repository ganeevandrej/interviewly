import { ProjectListPage } from '@/pages/project-list';
import { listProjects } from '@/server/projects';

export default async function ProjectsPage() {
    const projects = await listProjects();

    return <ProjectListPage initialProjects={projects} />;
}
