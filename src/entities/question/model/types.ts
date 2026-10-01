export type Question = {
    id: string;
    categoryId: string;
    topicId: string | null;
    position: number;
    question: string;
    answer: string;
};

export type QuestionInput = {
    topicId: string | null;
    question: string;
    answer: string;
};
