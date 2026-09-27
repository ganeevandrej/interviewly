'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/app/store/store';
import { theme } from '@/app/theme/theme';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </Provider>
    );
}
