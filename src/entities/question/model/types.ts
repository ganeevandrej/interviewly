export type Question = {
    id: string;
    groupId: string;
    topicId: string;
    position: number;
    question: string;
    answer: string;
};

export type QuestionInput = {
    topicId: string | null;
    question: string;
    answer: string;
};
