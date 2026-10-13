import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

type Props = { title: string; description: string };

export function EmptyState({ title, description }: Props) {
    return (
        <EmptyPanel variant="outlined">
            <EmptyIcon>▰</EmptyIcon>
            <Typography fontSize={18} fontWeight={600}>
                {title}
            </Typography>
            <Typography color="text.secondary">{description}</Typography>
        </EmptyPanel>
    );
}

const EmptyPanel = styled(Paper)(({ theme }) => ({
    minHeight: theme.spacing(22),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.down('md')]: { minHeight: theme.spacing(26) },
}));

const EmptyIcon = styled(Box)(({ theme }) => ({
    display: 'grid',
    width: theme.spacing(8),
    height: theme.spacing(8),
    placeItems: 'center',
    borderRadius: theme.spacing(2),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.dark,
    fontSize: 26,
}));
