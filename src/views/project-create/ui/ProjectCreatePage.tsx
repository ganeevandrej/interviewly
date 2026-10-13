'use client';

import { AppShell } from '@/widgets/app-shell';
import { ProjectCreateForm } from '@/features/project-create';
import { ProjectTechnologyEditor } from '@/features/project-technology-edit';

export default function ProjectCreatePage() {
    return (
        <AppShell>
            <ProjectCreateForm
                technologyEditor={(editorProps) => <ProjectTechnologyEditor {...editorProps} />}
            />
        </AppShell>
    );
}
