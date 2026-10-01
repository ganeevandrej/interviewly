import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { appShellText } from '../constants/appShell';

export function AppProfile() {
    return (
        <ProfileRoot direction="row" alignItems="center" gap={1.5}>
            <Avatar aria-hidden />
            <Stack gap={0.25}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45 }}>
                    {appShellText.profileName}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 12, lineHeight: 1.45 }}>
                    {appShellText.profileDescription}
                </Typography>
            </Stack>
        </ProfileRoot>
    );
}

const ProfileRoot = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(1.25),
    borderRadius: '12px',
    backgroundColor: theme.palette.background.default,
}));

const Avatar = styled(Box)(({ theme }) => ({
    width: 34,
    height: 34,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.dark,
}));
