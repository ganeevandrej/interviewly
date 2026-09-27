'use client';

import { ProjectDetailsContent } from '@/widgets/project-details';
import { ProjectTechnologyEditor } from '@/features/project-technology-edit';
import { ProjectQuestionsWidget } from '@/widgets/project-questions';
import type { Project } from '@/entities/project';

export default function ProjectDetailsPage({ initialProject }: { initialProject: Project }) {
    return (
        <ProjectDetailsContent
            initialProject={initialProject}
            technologyEditor={(editorProps) => <ProjectTechnologyEditor {...editorProps} />}
            questionsWidget={(questions) => <ProjectQuestionsWidget questions={questions} />}
        />
    );
}
