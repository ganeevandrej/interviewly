'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ProjectTechnologyInput } from '@/types';

type Props = {
  value: ProjectTechnologyInput[];
  onChange: (value: ProjectTechnologyInput[]) => void;
};

export function ProjectTechnologyWidget({ value, onChange }: Props) {
  function addTechnology() {
    const name = window.prompt('Название технологии');
    if (!name?.trim()) return;
    onChange([...value, { name: name.trim(), isFeatured: false }]);
  }

  return (
    <Stack gap={2}>
      <Typography color="text.secondary">
        Поиск и подключение технологий будет добавлено отдельным API.
      </Typography>
      <TextField label="Поиск технологий" placeholder="Например, React" disabled fullWidth />
      <Button
        variant="outlined"
        startIcon={<AddRoundedIcon />}
        onClick={addTechnology}
        sx={{ alignSelf: 'flex-start' }}
      >
        Добавить технологию
      </Button>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {value.map((technology) => (
          <Chip
            key={technology.id ?? technology.name}
            label={technology.name}
            color={technology.isFeatured ? 'primary' : 'default'}
            onClick={() =>
              onChange(
                value.map((item) =>
                  (item.id ?? item.name) === (technology.id ?? technology.name)
                    ? { ...item, isFeatured: !item.isFeatured }
                    : item,
                ),
              )
            }
            onDelete={() =>
              onChange(
                value.filter((item) => (item.id ?? item.name) !== (technology.id ?? technology.name)),
              )
            }
            deleteIcon={<DeleteOutlineRoundedIcon />}
          />
        ))}
      </Stack>
    </Stack>
  );
}
