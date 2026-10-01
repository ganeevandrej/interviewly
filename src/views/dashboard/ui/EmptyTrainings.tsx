import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { homePageText } from '../constants/homePageText';

export function EmptyTrainings() {
    return (
        <EmptyState variant="outlined">
            <Stack alignItems="center" gap={1.25}>
                <SubjectOutlinedIcon sx={{ color: 'primary.main', fontSize: 44 }} />
                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {homePageText.trainings.emptyTitle}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {homePageText.trainings.emptyDescription}
                </Typography>
                <Button component={Link} href="/trainings/new" variant="contained">
                    {homePageText.trainings.createFirstTraining}
                </Button>
            </Stack>
        </EmptyState>
    );
}

const EmptyState = styled(Paper)(({ theme }) => ({
    display: 'grid',
    minHeight: 180,
    placeItems: 'center',
    padding: theme.spacing(1, 3),
    textAlign: 'center',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
}));
