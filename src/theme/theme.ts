'use client';

import { alpha, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    divider: 'rgba(148, 163, 184, 0.2)',
    primary: { main: '#6d7cff' },
    secondary: { main: '#22d3ee' },
    error: { main: '#fb7185' },
    background: {
      default: '#060914',
      paper: 'rgba(15, 23, 42, 0.72)',
    },
    text: {
      primary: '#f8fbff',
      secondary: '#aab7d8',
    },
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 750, letterSpacing: 0 },
    h6: { fontWeight: 750, letterSpacing: 0 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        a: { color: 'inherit', textDecoration: 'none' },
        body: {
          minHeight: '100vh',
          background: `radial-gradient(circle at 50% -10%, ${alpha(theme.palette.primary.main, 0.32)}, transparent 34%), radial-gradient(circle at 85% 15%, ${alpha(theme.palette.secondary.main, 0.18)}, transparent 26%), ${theme.palette.background.default}`,
        },
      }),
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});
