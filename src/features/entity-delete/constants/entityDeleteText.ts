export const entityDeleteText = {
    deleteAriaLabel: (name: string) => `Удалить ${name}`,
    title: (name: string) => `Удалить ${name}?`,
    description: 'Связанные темы, вопросы и данные сущности будут удалены.',
    checkLinks: 'Проверить связи с тренировками',
    checking: 'Проверяем связи с тренировками…',
    checkErrorTitle: 'Не удалось проверить связи',
    checkErrorDescription: 'Проверьте подключение и попробуйте ещё раз.',
    retry: 'Повторить',
    linkedTrainingsTitle: 'Связанные тренировки',
    trainingStatus: {
        IN_PROGRESS: 'В работе',
        COMPLETED: 'Завершена',
    },
    noDependencies: 'Нет зависимых тренировок',
    deleteError: 'Не удалось удалить сущность.',
    cancel: 'Отмена',
    delete: 'Удалить',
} as const;
