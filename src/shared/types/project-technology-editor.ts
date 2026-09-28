import type { ProjectTechnologyInput } from '@/entities/project';

export type ProjectTechnologyEditorProps = {
    value: ProjectTechnologyInput[];
    onChange: (value: ProjectTechnologyInput[]) => void;
};

export type ProjectTechnologyEditorRenderer = (
    props: ProjectTechnologyEditorProps,
) => React.ReactNode;
