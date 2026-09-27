export type LibraryQuestion = {
    id: string;
    topicId: string;
    position: number;
    question: string;
    answer: string;
};

export type LibraryTopic = {
    id: string;
    groupId: string;
    name: string;
    isDefault: boolean;
    questions: LibraryQuestion[];
};

export type LibraryGroup = {
    id: string;
    name: string;
    accentColor: string;
    topics: LibraryTopic[];
};

export type LibraryData = {
    groups: Omit<LibraryGroup, 'topics'>[];
    topics: Omit<LibraryTopic, 'questions'>[];
    questions: (LibraryQuestion & { groupId: string })[];
};
