'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { InterviewlyStoreProvider } from '@/store/InterviewlyStoreProvider';
import { store } from '@/store/store';
import { theme } from '@/theme/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <InterviewlyStoreProvider>{children}</InterviewlyStoreProvider>
      </ThemeProvider>
    </Provider>
  );
}
