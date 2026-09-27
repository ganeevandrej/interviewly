'use client';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { ProjectTeamItem } from '@/entities/project';

import { FieldGroup } from './FieldGroup';

export function TeamEditor({
    value,
    onChange,
}: {
    value: ProjectTeamItem[];
    onChange: (value: ProjectTeamItem[]) => void;
}) {
    return (
        <FieldGroup title="Команда">
            {value.map((item, index) => (
                <Stack key={index} direction="row" gap={1}>
                    <TextField
                        label="Роль"
                        value={item.name}
                        onChange={(event) =>
                            onChange(
                                value.map((current, itemIndex) =>
                                    itemIndex === index
                                        ? { ...current, name: event.target.value }
                                        : current,
                                ),
                            )
                        }
                    />
                    <TextField
                        label="Количество"
                        type="number"
                        value={item.count}
                        onChange={(event) =>
                            onChange(
                                value.map((current, itemIndex) =>
                                    itemIndex === index
                                        ? { ...current, count: Number(event.target.value) }
                                        : current,
                                ),
                            )
                        }
                    />
                </Stack>
            ))}
            <Button variant="outlined" onClick={() => onChange([...value, { name: '', count: 1 }])}>
                Добавить участника
            </Button>
        </FieldGroup>
    );
}
