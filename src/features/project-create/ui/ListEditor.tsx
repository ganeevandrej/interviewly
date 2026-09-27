'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export function ListEditor({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
}) {
    return (
        <Stack gap={1.5}>
            {value.map((item, index) => (
                <TextField
                    key={index}
                    label={`${label} ${index + 1}`}
                    value={item}
                    onChange={(event) =>
                        onChange(value.map((current, itemIndex) =>
                            itemIndex === index ? event.target.value : current,
                        ))
                    }
                />
            ))}
            <Button variant="outlined" onClick={() => onChange([...value, ''])}>
                Добавить пункт
            </Button>
        </Stack>
    );
}
