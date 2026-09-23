'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    interviewly: {
      surfaces: { primarySubtle: string; input: string; pressed: string };
      shadows: { panel: string };
    };
  }

  interface ThemeOptions {
    interviewly?: {
      surfaces?: { primarySubtle?: string; input?: string; pressed?: string };
      shadows?: { panel?: string };
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    divider: '#34414B',
    primary: { main: '#70DECF', light: '#92EADC', dark: '#52C7B8', contrastText: '#102522' },
    secondary: { main: '#BCADF0', light: '#CFC3F7', dark: '#AA97E5', contrastText: '#241C38' },
    error: { main: '#FFADB4', contrastText: '#40272E' },
    success: { main: '#A4D79A' },
    warning: { main: '#F0CD87' },
    info: { main: '#A6C8F0' },
    background: {
      default: '#101417',
      paper: '#181E23',
    },
    text: {
      primary: '#EDF2F4',
      secondary: '#B0BEC7',
    },
  },
  typography: {
    fontFamily: 'Golos Text, Segoe UI, sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { lineHeight: 1.6 },
    button: { fontWeight: 500, textTransform: 'none', letterSpacing: 0 },
  },
  shape: { borderRadius: 12 },
  interviewly: {
    surfaces: { primarySubtle: '#193B38', input: '#101417', pressed: '#303D46' },
    shadows: { panel: '0 10px 28px rgba(0, 0, 0, 0.16)' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        '*:focus-visible': { outline: '2px solid #92EADC', outlineOffset: 2 },
        '::selection': {
          backgroundColor: theme.interviewly.surfaces.primarySubtle,
          color: '#EDF2F4',
        },
        a: { color: 'inherit', textDecoration: 'none' },
        body: {
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: 'none',
          minHeight: 44,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'background.default',
          },
        },
      },
    },
  },
});
