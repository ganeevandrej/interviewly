import { notFound } from 'next/navigation';

import { ProjectDetailsPage } from '@/pages/project-details';
import { readProject } from '@/server/projects';
import { InputError } from '@/server/validation';

export default async function ProjectPage(props: { params: Promise<{ projectId: string }> }) {
    const params = await props.params;
    let project;
    try {
        project = await readProject(params.projectId);
    } catch (error) {
        if (error instanceof InputError && error.status === 404) notFound();
        throw error;
    }

    return <ProjectDetailsPage initialProject={project} />;
}
