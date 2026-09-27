'use client';

import { ProjectCreateForm } from '@/features/project-create';
import { ProjectTechnologyEditor } from '@/features/project-technology-edit';
import { AppShell } from '@/widgets/app-shell';

export default function ProjectCreatePage() {
    return (
        <AppShell>
            <ProjectCreateForm
                technologyEditor={(editorProps) => <ProjectTechnologyEditor {...editorProps} />}
            />
        </AppShell>
    );
}
