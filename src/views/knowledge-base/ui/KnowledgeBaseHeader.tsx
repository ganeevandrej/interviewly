import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { knowledgeBaseText } from '../constants/knowledgeBaseText';

type Props = { hidden: boolean; onCreate: () => void };

export function KnowledgeBaseHeader({ hidden, onCreate }: Props) {
    return (
        <HeaderRoot>
            <HeaderCopy>
                <Typography variant="h3">{knowledgeBaseText.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {knowledgeBaseText.description}
                </Typography>
            </HeaderCopy>
            <CreateButton
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onCreate}
                hiddenOnMobile={hidden}
            >
                {knowledgeBaseText.createCategory}
            </CreateButton>
        </HeaderRoot>
    );
}

const HeaderRoot = styled(Stack)(({ theme }) => ({
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: { flexDirection: 'row', alignItems: 'center' },
}));

const HeaderCopy = styled(Box)({ maxWidth: 720 });

const CreateButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'hiddenOnMobile' })<{
    hiddenOnMobile: boolean;
}>(({ theme, hiddenOnMobile }) => ({
    [theme.breakpoints.down('sm')]: { display: hiddenOnMobile ? 'none' : 'inline-flex' },
}));
