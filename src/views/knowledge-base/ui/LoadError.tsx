import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type LoadErrorProps = {
    onRetry: () => void;
};

export function LoadError({ onRetry }: LoadErrorProps) {
    return (
        <Stack alignItems="center" textAlign="center" sx={{ minHeight: 360, pt: 8 }}>
            <ErrorOutlineRoundedIcon color="error" sx={{ fontSize: 48 }} />
            <Typography variant="h4" sx={{ mt: 2 }}>
                Не удалось загрузить категории
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
                Проверьте подключение и попробуйте ещё раз.
            </Typography>
            <Button variant="outlined" onClick={onRetry} sx={{ mt: 3 }}>
                Повторить
            </Button>
        </Stack>
    );
}
