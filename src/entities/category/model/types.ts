export type Category = {
    id: string;
    name: string;
    accentColor: string;
};

export type CategoryQuestion = {
    id: string;
    categoryId: string;
    topicId: string | null;
    position: number;
    topicPosition?: number | null;
    question: string;
    answer: string;
};

export type CategoryLibrary = {
    category: Category;
    topics: { id: string; categoryId: string; name: string }[];
    questions: { id: string; question: string; answer: string }[];
    categoryQuestions: { categoryId: string; questionId: string; position: number }[];
    topicQuestions: { topicId: string; questionId: string; position: number }[];
};
