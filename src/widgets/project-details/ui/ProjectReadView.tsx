'use client';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ProjectQuestionsWidget } from '@/widgets/project-questions';
import { GlassPanel } from '@/shared/ui/glass-panel';
import type { Project } from '@/entities/project';

export function ProjectReadView({ project }: { project: Project }) {
    return (
        <Stack gap={2.5}>
            <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                    {project.title}
                </Typography>
                <Chip
                    label={project.status === 'READY' ? 'Готов' : 'Черновик'}
                    color={project.status === 'READY' ? 'success' : 'default'}
                />
            </Stack>
            <Typography color="text.secondary">
                {project.description || 'Описание пока не добавлено.'}
            </Typography>
            <InfoBlock title="Команда">
                <Typography>
                    {project.team.map((item) => `${item.name} | ${item.count}`).join(' · ') ||
                        'Не указана'}
                </Typography>
            </InfoBlock>
            <InfoBlock title="Стек">
                <Stack direction="row" gap={1} flexWrap="wrap">
                    {project.technologies.map((item) => (
                        <Chip
                            key={item.id}
                            label={item.name}
                            color={item.isFeatured ? 'primary' : 'default'}
                        />
                    ))}
                </Stack>
            </InfoBlock>
            <InfoBlock title="Задачи">
                <BulletList items={project.tasks} />
            </InfoBlock>
            <InfoBlock title="Обязанности">
                <BulletList items={project.responsibilities} />
            </InfoBlock>
            <InfoBlock title="Достижения">
                <BulletList items={project.achievements} />
            </InfoBlock>
            <InfoBlock title="Вопросы">
                <ProjectQuestionsWidget questions={project.questions} />
            </InfoBlock>
        </Stack>
    );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <GlassPanel sx={{ p: 2.5 }}>
            <Stack gap={1}>
                <Typography variant="h6">{title}</Typography>
                {children}
            </Stack>
        </GlassPanel>
    );
}

function BulletList({ items }: { items: string[] }) {
    return items.length ? (
        <Stack component="ul" sx={{ m: 0, pl: 2.5 }}>
            {items.map((item, index) => (
                <Typography component="li" key={index}>
                    {item}
                </Typography>
            ))}
        </Stack>
    ) : (
        <Typography color="text.secondary">Пока не заполнено.</Typography>
    );
}
