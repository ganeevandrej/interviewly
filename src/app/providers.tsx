'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { InterviewlyStoreProvider } from '@/store/InterviewlyStoreProvider';
import { theme } from '@/theme/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <InterviewlyStoreProvider>{children}</InterviewlyStoreProvider>
    </ThemeProvider>
  );
}
