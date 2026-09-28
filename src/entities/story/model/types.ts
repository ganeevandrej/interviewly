export type StoryTag = { id: string; name: string };

export type StoryQuestion = { id: string; question: string; groupId: string };

export type Story = {
    id: string;
    title: string;
    context: string | null;
    problem: string | null;
    responsibility: string | null;
    solution: string | null;
    difficulties: string | null;
    learned: string | null;
    additionalQuestions: string | null;
    tags: StoryTag[];
    questions: StoryQuestion[];
};

export type StoryInput = Omit<Story, 'id' | 'tags' | 'questions'> & {
    tags: string[];
    questionIds: string[];
};
