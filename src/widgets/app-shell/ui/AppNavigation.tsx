import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

import { appNavigationItems } from '../constants/appShell';

export function AppNavigation({
    pathname,
    onNavigate,
}: {
    pathname: string;
    onNavigate?: () => void;
}) {
    return (
        <Stack gap={0.75}>
            {appNavigationItems.map((item) => {
                const isCurrent =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                    <NavigationLink
                        key={item.href}
                        href={item.href}
                        isCurrent={isCurrent}
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={onNavigate}
                    >
                        <Icon sx={{ mr: 1.5 }} />
                        {item.label}
                    </NavigationLink>
                );
            })}
        </Stack>
    );
}

const NavigationLink = styled(Link, { shouldForwardProp: (prop) => prop !== 'isCurrent' })<{
    isCurrent: boolean;
}>(({ theme, isCurrent }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 48,
    padding: theme.spacing(0, 1.75),
    color: isCurrent ? theme.palette.primary.main : theme.palette.text.secondary,
    backgroundColor: isCurrent ? theme.interviewly.surfaces.primarySubtle : 'transparent',
    fontSize: 15,
    fontWeight: isCurrent ? 600 : 500,
}));
