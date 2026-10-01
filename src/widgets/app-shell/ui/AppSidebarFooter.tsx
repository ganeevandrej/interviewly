import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { appShellText } from '../constants/appShell';

import { AppProfile } from './AppProfile';

export function AppSidebarFooter() {
    return (
        <Stack gap={1.5}>
            <SettingsRow direction="row" alignItems="center" gap={1.5}>
                <SettingsOutlinedIcon />
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                    {appShellText.settings}
                </Typography>
            </SettingsRow>
            <AppProfile />
        </Stack>
    );
}

const SettingsRow = styled(Stack)(({ theme }) => ({
    minHeight: 48,
    padding: theme.spacing(0, 1.75),
    color: theme.palette.text.secondary,
}));
