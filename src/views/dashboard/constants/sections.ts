import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';

import type { SectionCardProps } from '../ui/SectionCard';

export const sections = [
    {
        title: 'База знаний',
        description: 'Вопросы и ответы, собранные по темам и категориям.',
        href: '/knowledge-base',
        icon: MenuBookOutlinedIcon,
        color: 'primary',
    },
    {
        title: 'Истории',
        description: 'Профессиональные ситуации для уверенных ответов по STAR.',
        href: '/stories',
        icon: SubjectOutlinedIcon,
        color: 'secondary',
    },
    {
        title: 'Проекты',
        description: 'Контекст, задачи и результаты по каждому проекту.',
        href: '/projects',
        icon: FolderOutlinedIcon,
        color: 'info',
    },
] satisfies SectionCardProps[];
