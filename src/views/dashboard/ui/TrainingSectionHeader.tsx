import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { homePageText } from '../constants/homePageText';

export function TrainingSectionHeader() {
    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
            gap={1.5}
        >
            <Stack gap={0.25}>
                <Typography sx={{ fontSize: { xs: 22, md: 24 }, fontWeight: 600 }}>
                    {homePageText.trainings.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {homePageText.trainings.description}
                </Typography>
            </Stack>
            <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                gap={2}
            >
                <Button
                    component={Link}
                    href="/trainings"
                    variant="text"
                    sx={{ textDecoration: 'underline' }}
                >
                    {homePageText.trainings.allTrainings}
                </Button>
                <Button
                    component={Link}
                    href="/trainings/new"
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    sx={{ minWidth: { sm: 190 } }}
                >
                    {homePageText.trainings.createTraining}
                </Button>
            </Stack>
        </Stack>
    );
}
