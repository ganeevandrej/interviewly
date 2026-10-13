import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { knowledgeBaseText } from '@/views/knowledge-base/constants/knowledgeBaseText';

type EmptyStateProps = {
    onCreate: () => void;
};

export function EmptyState({ onCreate }: EmptyStateProps) {
    return (
        <EmptyStateRoot>
            <Stack alignItems="center" gap={1.25}>
                <Illustration>
                    <AccountTreeRoundedIcon
                        sx={{ fontSize: { xs: 50, sm: 58 }, color: 'primary.main' }}
                    />
                </Illustration>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    {knowledgeBaseText.emptyEyebrow}
                </Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: { xs: 2, sm: 2.25 } }}>
                {knowledgeBaseText.emptyTitle}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560, mt: 1.5 }}>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {knowledgeBaseText.emptyDescription}
                </Box>
                <Box component="span" sx={{ display: { sm: 'none' } }}>
                    {knowledgeBaseText.emptyDescriptionCompact}
                </Box>
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onCreate}
                sx={{ width: { xs: 306, sm: 186 }, mt: { xs: 2, sm: 2.25 } }}
            >
                {knowledgeBaseText.createCategory}
            </Button>
        </EmptyStateRoot>
    );
}

const EmptyStateRoot = styled(Stack)(({ theme }) => ({
    minHeight: 500,
    alignItems: 'center',
    paddingTop: theme.spacing(12.5),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: { minHeight: 560, paddingTop: theme.spacing(14) },
}));

const Illustration = styled(Box)(({ theme }) => ({
    display: 'grid',
    width: 128,
    height: 128,
    placeItems: 'center',
    borderRadius: '50%',
    backgroundColor: theme.interviewly.surfaces.primarySubtle,
    [theme.breakpoints.up('sm')]: { width: 180, height: 150 },
}));
