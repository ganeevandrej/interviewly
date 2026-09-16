'use client';

import Paper, { PaperProps } from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
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
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.78)}, ${alpha(theme.palette.background.paper, 0.42)})`,
          boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.34)}`,
          backdropFilter: 'blur(18px)',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
