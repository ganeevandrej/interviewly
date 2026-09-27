'use client';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { FieldGroup } from './FieldGroup';

export function EditableList({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
}) {
    return (
        <FieldGroup title={label}>
            {value.map((item, index) => (
                <TextField
                    key={index}
                    label={`${label} ${index + 1}`}
                    value={item}
                    onChange={(event) =>
                        onChange(
                            value.map((current, itemIndex) =>
                                itemIndex === index ? event.target.value : current,
                            ),
                        )
                    }
                />
            ))}
            <Button variant="outlined" onClick={() => onChange([...value, ''])}>
                Добавить пункт
            </Button>
        </FieldGroup>
    );
}
