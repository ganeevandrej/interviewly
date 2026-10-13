import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import type { Metadata } from 'next';

import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'Interviewly',
    description: 'Спокойная библиотека для подготовки к собеседованиям',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
            <body>
                <AppRouterCacheProvider>
                    <Providers>{children}</Providers>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
