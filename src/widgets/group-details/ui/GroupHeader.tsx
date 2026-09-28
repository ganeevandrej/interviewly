'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { GroupDialog } from '@/features/group-create';
import { GroupDeleteFeature } from '@/features/group-delete';
import { GroupEditFeature } from '@/features/group-edit';

import type { QuestionGroup } from '@/entities/group';

export function GroupHeader({
    group,
    questionCount,
    onSaved,
}: {
    group: QuestionGroup;
    questionCount: number;
    onSaved: (group: QuestionGroup) => void;
}) {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
            <Stack direction="row" gap={2} alignItems="center">
                <Box
                    sx={{
                        width: 76,
                        height: 76,
                        borderRadius: '16px',
                        display: 'grid',
                        placeItems: 'center',
                        background: group.accentColor,
                        color: 'background.default',
                        fontWeight: 900,
                        fontSize: 24,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {group.name.slice(0, 2).toUpperCase()}
                </Box>
                <Box>
                    <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                        {group.name}
                    </Typography>
                    <Typography color="text.secondary">{questionCount} вопросов</Typography>
                </Box>
            </Stack>
            <Stack direction="row" gap={1}>
                <GroupEditFeature group={group} dialog={GroupDialog} onSaved={onSaved} />
                <GroupDeleteFeature groupId={group.id} />
            </Stack>
        </Stack>
    );
}
