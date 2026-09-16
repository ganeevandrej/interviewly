'use client';

import { Paper, PaperProps } from '@mui/material';
import { ElementType } from 'react';

type GlassPanelProps = PaperProps & {
  component?: ElementType;
  href?: string;
};

export function GlassPanel(props: GlassPanelProps) {
  return (
    <Paper
      {...props}
      sx={{
        border: '1px solid rgba(148, 163, 184, 0.2)',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.42))',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.34)',
        backdropFilter: 'blur(18px)',
        ...props.sx
      }}
    />
  );
}

