import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { formatCount } from '@/entities/category';

import { knowledgeBaseText } from '../constants/knowledgeBaseText';

type Props = { search: string; count: number; onSearchChange: (value: string) => void };

export function CategoryListControls({ search, count, onSearchChange }: Props) {
    return (
        <>
            <TextField
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={knowledgeBaseText.searchPlaceholder}
                inputProps={{ 'aria-label': knowledgeBaseText.searchAriaLabel }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchRoundedIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">{knowledgeBaseText.categories}</Typography>
                <Typography color="text.secondary">
                    {formatCount(count, 'категория', 'категории', 'категорий')}
                </Typography>
            </Stack>
        </>
    );
}
