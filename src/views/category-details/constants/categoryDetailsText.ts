export const categoryDetailsText = {
    breadcrumbs: {
        knowledgeBase: 'База знаний',
        separator: '›',
    },
    description: 'Создавайте темы и вопросы, чтобы удобно готовиться к собеседованию.',
    editCategory: 'Редактировать категорию',
    error: {
        title: 'Не удалось загрузить данные',
        description: 'Проверьте подключение к интернету и попробуйте ещё раз.',
        retry: 'Повторить',
    },
    topics: {
        title: 'Темы',
        create: 'Создать тему',
        edit: 'Редактировать тему',
        open: 'Открыть',
        questionsCount: (count: number) => `${count} вопросов`,
        emptyTitle: 'Пока нет тем',
        emptyDescription: 'Создайте первую тему, чтобы собирать вопросы по направлениям.',
    },
    questions: {
        title: 'Вопросы без темы',
        description: 'Эти вопросы принадлежат категории независимо от тем.',
        create: 'Добавить вопрос',
        open: 'Открыть',
        openFocus: 'Открыть focus',
        edit: 'Редактировать вопрос',
        emptyTitle: 'Пока нет вопросов без темы',
        emptyDescription: 'Добавляйте вопросы сразу или создавайте темы для удобной группировки.',
    },
} as const;
