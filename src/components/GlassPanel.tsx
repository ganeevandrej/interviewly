'use client';

import Paper, { PaperProps } from '@mui/material/Paper';
import { ElementType } from 'react';

export function GlassPanel<C extends ElementType = 'div'>({
  sx = [],
  ...props
}: PaperProps<C, { component?: C }>) {
  return (
    <Paper
      {...props}
      sx={[
        (theme) => ({
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.interviewly.shadows.panel,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
