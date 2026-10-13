import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { homePageText } from '@/views/dashboard/constants/homePageText';
import { sections } from '@/views/dashboard/constants/sections';

import { SectionCard } from '@/views/dashboard/ui/SectionCard';

export function SectionNavigation() {
    return (
        <Stack gap={{ xs: 2, md: 0 }}>
            <Typography
                sx={{ display: { xs: 'block', md: 'none' }, fontSize: 22, fontWeight: 600 }}
            >
                {homePageText.sections.title}
            </Typography>
            <SectionGrid>
                {sections.map((section) => (
                    <SectionCard key={section.href} {...section} />
                ))}
            </SectionGrid>
        </Stack>
    );
}

const SectionGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
}));
