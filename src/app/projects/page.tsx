import { listProjects } from '@/server/projects';
import ClientPage from './ClientPage';

export default async function ProjectsPage() {
  const projects = await listProjects();

  return <ClientPage initialProjects={projects} />;
}
