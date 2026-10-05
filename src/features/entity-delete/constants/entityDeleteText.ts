export const entityDeleteText = {
    deleteAriaLabel: (name: string) => `Удалить ${name}`,
    title: (name: string) => `Удалить ${name}?`,
    description: 'Связанные темы, вопросы и данные сущности будут удалены.',
    checkLinks: 'Проверить связи с тренировками',
    linkedTrainings: (count: number) => `Связанных тренировок: ${count}`,
    cancel: 'Отмена',
    delete: 'Удалить',
} as const;
