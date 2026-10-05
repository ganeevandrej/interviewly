export const entityColorSelectText = {
    label: 'Цвет',
    selected: 'Выбран:',
    choose: (name: string) => `Выбрать ${name} цвет`,
} as const;

export const categoryCreateColors = [
    { name: 'мятный', value: '#1F8A8A' },
    { name: 'лавандовый', value: '#8B7CC8' },
    { name: 'голубой', value: '#4C8ED9' },
    { name: 'зелёный', value: '#6FA05B' },
    { name: 'янтарный', value: '#C58A2E' },
    { name: 'розовый', value: '#C65C70' },
] as const;

export const defaultCategoryColor = categoryCreateColors[0].value;
