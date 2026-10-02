import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import type { ElementType } from 'react';

export type SectionCardProps = {
    title: string;
    description: string;
    href: string;
    icon: ElementType;
    color: 'primary' | 'secondary' | 'info';
};

export function SectionCard({ title, description, href, icon: Icon, color }: SectionCardProps) {
    return (
        <Link href={href}>
            <CardRoot variant="outlined">
                <IconContainer
                    sx={(theme) => ({
                        backgroundColor:
                            color === 'primary'
                                ? theme.interviewly.surfaces.primarySubtle
                                : color === 'secondary'
                                  ? theme.interviewly.surfaces.secondarySubtle
                                  : theme.interviewly.surfaces.infoSubtle,
                        color: `${color}.main`,
                    })}
                >
                    <Icon sx={{ fontSize: { xs: 22, md: 24 } }} />
                </IconContainer>
                <Stack gap={0.5} sx={{ flex: 1 }}>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                    <Typography
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            mt: 1,
                            color: `${color}.main`,
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        Перейти →
                    </Typography>
                </Stack>
                <ArrowForwardRoundedIcon
                    sx={{ display: { xs: 'block', md: 'none' }, color: `${color}.main` }}
                />
            </CardRoot>
        </Link>
    );
}

const CardRoot = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minHeight: 112,
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2.25),
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    '&:hover': { backgroundColor: theme.interviewly.surfaces.raised },
    [theme.breakpoints.up('md')]: {
        minHeight: 220,
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: theme.spacing(3),
    },
}));

const IconContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    width: 44,
    height: 44,
    flex: '0 0 auto',
    placeItems: 'center',
    borderRadius: '12px',
    [theme.breakpoints.up('md')]: { width: 48, height: 48 },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontWeight: 600,
    [theme.breakpoints.up('md')]: { fontSize: 18 },
}));

const CardDescription = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: 12,
    lineHeight: 1.45,
    [theme.breakpoints.up('md')]: { fontSize: 14 },
}));
