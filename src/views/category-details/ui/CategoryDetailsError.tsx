import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { categoryDetailsText } from '@/views/category-details/constants/categoryDetailsText';

type Props = { categoryName?: string; onRetry: () => void };

export function CategoryDetailsError({ categoryName, onRetry }: Props) {
    return (
        <Stack gap={3}>
            {categoryName && (
                <Box>
                    <Typography variant="h3">{categoryName}</Typography>
                    <Typography color="text.secondary">
                        {categoryDetailsText.description}
                    </Typography>
                </Box>
            )}
            <ErrorPanel>
                <Typography variant="h5">{categoryDetailsText.error.title}</Typography>
                <Typography color="text.secondary">
                    {categoryDetailsText.error.description}
                </Typography>
                <Button variant="outlined" color="error" onClick={onRetry}>
                    {categoryDetailsText.error.retry}
                </Button>
            </ErrorPanel>
        </Stack>
    );
}

const ErrorPanel = styled(Paper)(({ theme }) => ({
    minHeight: theme.spacing(44.75),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.error.dark,
    borderColor: theme.palette.error.main,
    [theme.breakpoints.down('md')]: { minHeight: theme.spacing(50.5) },
}));
