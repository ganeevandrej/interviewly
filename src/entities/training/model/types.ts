export type TrainingOrder = 'SEQUENTIAL' | 'RANDOM';
export type TrainingStatus = 'IN_PROGRESS' | 'COMPLETED';
export type TrainingQuestionStatus = 'IN_PROGRESS' | 'ACCEPTED';

export type TrainingInput = {
    name: string;
    order: TrainingOrder;
    questionLimit?: number | null;
    categoryIds: string[];
    topicIds: string[];
    questionIds: string[];
};

export type Training = {
    id: string;
    name: string;
    order: TrainingOrder;
    status: TrainingStatus;
    questionLimit: number | null;
    categories: { id: string; name: string; accentColor: string }[];
    topics: { id: string; categoryId: string; name: string }[];
    questions: {
        id: string;
        question: string;
        answer: string;
        position: number;
        status: TrainingQuestionStatus;
    }[];
};
