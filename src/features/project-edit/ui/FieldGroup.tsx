'use client';

import Stack from '@mui/material/Stack';

export function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Stack gap={1}>
            <strong>{title}</strong>
            {children}
        </Stack>
    );
}
