import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { homePageText } from '../constants/homePageText';

export function InterviewFeature() {
    return (
        <FeaturePanel variant="outlined">
            <FeatureCopy gap={1.75}>
                <FeatureBadge label={homePageText.interview.badge} size="small" />
                <Typography sx={{ fontSize: { xs: 22, md: 24 }, fontWeight: 600 }}>
                    {homePageText.interview.title}
                </Typography>
                <Typography
                    sx={{ color: 'text.secondary', fontSize: { xs: 14, md: 15 }, lineHeight: 1.45 }}
                >
                    {homePageText.interview.description}
                </Typography>
                <Button
                    component={Link}
                    href="/interview"
                    variant="contained"
                    sx={{ alignSelf: { xs: 'stretch', md: 'flex-start' } }}
                >
                    {homePageText.interview.action}
                </Button>
            </FeatureCopy>
            <FeatureVisual>
                <RecordVoiceOverOutlinedIcon sx={{ fontSize: 42 }} />
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                    {homePageText.interview.visualTitle}
                </Typography>
            </FeatureVisual>
        </FeaturePanel>
    );
}

const FeaturePanel = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    padding: theme.spacing(2.875),
    borderRadius: '16px',
    borderColor: theme.palette.divider,
    backgroundColor: theme.interviewly.surfaces.raised,
    [theme.breakpoints.up('md')]: {
        minHeight: 220,
        padding: theme.spacing(4),
        borderRadius: '20px',
    },
}));

const FeatureCopy = styled(Stack)({ maxWidth: 650 });

const FeatureBadge = styled(Chip)(({ theme }) => ({
    alignSelf: 'flex-start',
    color: theme.palette.secondary.main,
    backgroundColor: theme.interviewly.surfaces.secondarySubtle,
    fontSize: 12,
    fontWeight: 600,
}));

const FeatureVisual = styled(Stack)(({ theme }) => ({
    display: 'none',
    width: 240,
    height: 150,
    flex: '0 0 auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.25),
    borderRadius: '16px',
    backgroundColor: theme.interviewly.surfaces.secondarySubtle,
    color: theme.palette.secondary.main,
    [theme.breakpoints.up('md')]: { display: 'flex' },
}));
