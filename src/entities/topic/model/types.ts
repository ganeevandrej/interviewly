export type Topic = {
    id: string;
    categoryId: string;
    name: string;
    accentColor: string;
};

export type TopicDeletionImpact = {
    trainingCount: number;
    trainings: {
        id: string;
        name: string;
        status: 'IN_PROGRESS' | 'COMPLETED'
    }[];
};
