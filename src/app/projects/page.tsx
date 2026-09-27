import { listProjects } from '@/server/projects';
import { ProjectListPage } from '@/pages/project-list';

export default async function ProjectsPage() {
    const projects = await listProjects();

    return <ProjectListPage initialProjects={projects} />;
}
