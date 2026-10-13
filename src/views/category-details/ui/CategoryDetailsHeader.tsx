import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { categoryDetailsText } from '@/views/category-details/constants/categoryDetailsText';

type Props = { name: string; accentColor: string; onEdit: () => void };

export function CategoryDetailsHeader({ name, accentColor, onEdit }: Props) {
    return (
        <HeaderRow>
            <Box>
                <Stack direction="row" gap={1.5} alignItems="center">
                    <AccentBar sx={{ backgroundColor: accentColor }} />
                    <Typography variant="h3">{name}</Typography>
                </Stack>
                <Typography color="text.secondary">
                    {categoryDetailsText.description}
                </Typography>
            </Box>
            <>
                <Button
                    variant="outlined"
                    onClick={onEdit}
                    sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                >
                    {categoryDetailsText.editCategory}
                </Button>
                <IconButton
                    onClick={onEdit}
                    aria-label={categoryDetailsText.editCategory}
                    sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                >
                    <EditRoundedIcon />
                </IconButton>
            </>
        </HeaderRow>
    );
}

const HeaderRow = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
}));

const AccentBar = styled(Box)({
    width: 8,
    height: 36,
    borderRadius: 4,
});
