import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type EmptyStateProps = {
    onCreate: () => void;
};

export function EmptyState({ onCreate }: EmptyStateProps) {
    return (
        <Stack
            alignItems="center"
            textAlign="center"
            sx={{ minHeight: { xs: 500, sm: 560 }, pt: { xs: 12.5, sm: 14 } }}
        >
            <Stack alignItems="center" gap={1.25}>
                <Box
                    sx={{
                        display: 'grid',
                        width: { xs: 128, sm: 180 },
                        height: { xs: 128, sm: 150 },
                        placeItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: (theme) => theme.interviewly.surfaces.primarySubtle,
                    }}
                >
                    <AccountTreeRoundedIcon
                        sx={{ fontSize: { xs: 50, sm: 58 }, color: 'primary.main' }}
                    />
                </Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Структура начинается здесь
                </Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: { xs: 2, sm: 2.25 } }}>
                Создайте первую категорию
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560, mt: 1.5 }}>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Категории объединяют связанные темы и вопросы — так нужные материалы проще
                    находить и повторять.
                </Box>
                <Box component="span" sx={{ display: { sm: 'none' } }}>
                    Объединяйте связанные темы и вопросы, чтобы быстрее находить материалы.
                </Box>
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={onCreate}
                sx={{ width: { xs: 306, sm: 186 }, mt: { xs: 2, sm: 2.25 } }}
            >
                Создать категорию
            </Button>
        </Stack>
    );
}
