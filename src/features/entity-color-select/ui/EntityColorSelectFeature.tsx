import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

import { categoryCreateColors, entityColorSelectText } from '../constants/entityColorSelectText';

export type EntityColorOption = { name: string; value: string };

type EntityColorSelectFeatureProps = {
    value?: string;
    label?: string;
    onChange: (value: string) => void;
};

export function EntityColorSelectFeature({
    value,
    label = entityColorSelectText.label,
    onChange,
}: EntityColorSelectFeatureProps) {
    useEffect(() => {
        if (!value) onChange(categoryCreateColors[0].value);
    }, [onChange, value]);

    return (
        <Box>
            <ColorLabel variant="body2">{label}</ColorLabel>
            <Options direction="row">
                {categoryCreateColors.map((option) => (
                    <ColorButton
                        key={option.value}
                        aria-label={entityColorSelectText.choose(option.name)}
                        aria-pressed={value === option.value}
                        selected={value === option.value}
                        borderColor={value}
                        onClick={() => onChange(option.value)}
                    >
                        <ColorPreview color={option.value} />
                    </ColorButton>
                ))}
            </Options>
            <SelectedColor variant="body2" color="text.secondary">
                {entityColorSelectText.selected}{' '}
                {categoryCreateColors.find((option) => option.value === value)?.name}
            </SelectedColor>
        </Box>
    );
}

const Options = styled(Stack)(({ theme }) => ({ gap: theme.spacing(1.75) }));
const ColorLabel = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontSize: 13,
    lineHeight: '19px',
    fontWeight: 500,
    color: theme.palette.text.secondary,
}));
const SelectedColor = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
    fontSize: 12,
    lineHeight: '17px',
}));

const ColorButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'borderColor',
})<{
    selected: boolean;
    borderColor?: string;
}>(({ theme, selected, borderColor }) => ({
    width: selected ? 48 : 46,
    height: selected ? 48 : 46,
    borderStyle: 'solid',
    borderWidth: selected ? 2 : 1,
    borderColor: selected ? borderColor : theme.palette.divider,
    padding: 5,
    borderRadius: 14,
}));

const ColorPreview = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' })<{
    color: string;
}>(({ color }) => ({
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: color,
}));
