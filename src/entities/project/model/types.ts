export type ProjectStatus = 'DRAFT' | 'READY';
export type ProjectTag = { id: string; name: string };
export type ProjectTeamItem = { name: string; count: number };
export type Technology = { id: string; name: string };
export type ProjectTechnology = Technology & { isFeatured: boolean };
export type ProjectTechnologyInput = { id?: string; name?: string; isFeatured: boolean };
export type ProjectQuestion = { id: string; question: string; answer: string };

export type Project = {
    id: string;
    title: string;
    color: string;
    description: string | null;
    team: ProjectTeamItem[];
    tasks: string[];
    responsibilities: string[];
    achievements: string[];
    status: ProjectStatus;
    technologies: ProjectTechnology[];
    questions: ProjectQuestion[];
    tag: ProjectTag | null;
    histories: ProjectHistory[];
};

export type ProjectHistory = {
    id: string;
    title: string;
};

export type ProjectListItem = Pick<Project, 'id' | 'title' | 'color' | 'status' | 'technologies'>;

export type ProjectInput = Omit<
    Project,
    'id' | 'status' | 'technologies' | 'questions' | 'tag' | 'histories'
> & {
    status?: ProjectStatus;
    technologies?: ProjectTechnologyInput[];
};

export type ProjectStep =
    | 'title-color'
    | 'description'
    | 'team'
    | 'technologies'
    | 'tasks'
    | 'responsibilities'
    | 'achievements';
