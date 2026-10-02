import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';

import type { SvgIconComponent } from '@mui/icons-material';

export const appShellText = {
    brand: 'Interviewly',
    profileName: 'Андрей',
    profileDescription: 'Личная библиотека',
    settings: 'Настройки',
    openNavigation: 'Открыть навигацию',
    closeNavigation: 'Закрыть навигацию',
} as const;

export type AppNavigationItem = {
    href: string;
    label: string;
    icon: SvgIconComponent;
};

export const appNavigationItems: AppNavigationItem[] = [
    { href: '/', label: 'Главная', icon: HomeRoundedIcon },
    { href: '/knowledge-base', label: 'База знаний', icon: MenuBookRoundedIcon },
    { href: '/stories', label: 'Истории', icon: DescriptionOutlinedIcon },
    { href: '/projects', label: 'Проекты', icon: WorkOutlineRoundedIcon },
    { href: '/trainings', label: 'Тренировки', icon: SchoolRoundedIcon },
    { href: '/interview', label: 'Собеседование', icon: RecordVoiceOverRoundedIcon },
];
