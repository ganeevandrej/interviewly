import { readProject } from '@/server/projects';
import { InputError } from '@/server/validation';
import { notFound } from 'next/navigation';
import { ProjectDetailsPage } from '@/pages/project-details';

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
    let project;
    try {
        project = await readProject(params.projectId);
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }

    return <ProjectDetailsPage initialProject={project} />;
}
