'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { appShellText } from '../constants/appShell';

import { AppBrand } from './AppBrand';
import { AppNavigation } from './AppNavigation';
import { AppSidebarFooter } from './AppSidebarFooter';

import type { ReactNode } from 'react';

type AppShellProps = { children: ReactNode };

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <ShellRoot>
            <DesktopSidebar component="aside">
                <AppBrand />
                <AppNavigation pathname={pathname} />
                <Box sx={{ flex: 1 }} />
                <AppSidebarFooter />
            </DesktopSidebar>

            <ContentRoot>
                <MobileHeader component="header">
                    <AppBrand compact />
                    <IconButton
                        aria-label={appShellText.openNavigation}
                        onClick={() => setDrawerOpen(true)}
                        sx={{ width: 44, height: 44, backgroundColor: 'background.default' }}
                    >
                        <MenuRoundedIcon />
                    </IconButton>
                </MobileHeader>

                <Box component="main">
                    <PageContainer maxWidth={false}>{children}</PageContainer>
                </Box>
            </ContentRoot>

            <MobileDrawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
                <DrawerContent>
                    <DrawerHeader>
                        <AppBrand compact />
                        <IconButton
                            aria-label={appShellText.closeNavigation}
                            onClick={closeDrawer}
                            sx={{ width: 44, height: 44, backgroundColor: 'background.default' }}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                    </DrawerHeader>
                    <DrawerNavigation>
                        <AppNavigation pathname={pathname} onNavigate={closeDrawer} />
                    </DrawerNavigation>
                    <Box sx={{ flex: 1 }} />
                    <AppSidebarFooter />
                </DrawerContent>
            </MobileDrawer>
        </ShellRoot>
    );
}

const ShellRoot = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: theme.palette.background.default,
}));
const DesktopSidebar = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    display: 'none',
    width: 240,
    height: '100vh',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(4, 2.5, 3.5),
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: { display: 'flex' },
}));
const ContentRoot = styled(Box)({ minWidth: 0, flex: 1 });
const MobileHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: { display: 'none' },
}));
const PageContainer = styled(Container)(({ theme }) => ({
    maxWidth: '1200px !important',
    padding: theme.spacing(3, 2.5),
    [theme.breakpoints.up('md')]: { padding: theme.spacing(4, 5) },
}));
const MobileDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: 312,
        padding: theme.spacing(2.5),
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
    },
}));
const DrawerContent = styled(Stack)({ height: '100%' });
const DrawerHeader = styled(Stack)({
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
});
const DrawerNavigation = styled(Stack)(({ theme }) => ({ marginTop: theme.spacing(2.75) }));
