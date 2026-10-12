export type DeletionImpact = {
    trainingCount: number;
    trainings?: {
        id: string;
        name: string;
        status: 'IN_PROGRESS' | 'COMPLETED';
    }[];
};

export type EntitySummary = {
    title: string;
    meta: string;
    accentColor?: string;
};
