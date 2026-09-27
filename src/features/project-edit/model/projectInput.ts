import type { Project, ProjectInput } from '@/entities/project';

export function toProjectInput(project: Project): ProjectInput {
    return {
        title: project.title,
        color: project.color,
        description: project.description,
        team: project.team,
        tasks: project.tasks,
        responsibilities: project.responsibilities,
        achievements: project.achievements,
        technologies: project.technologies.map((item) => ({ ...item })),
        status: project.status,
    };
}
