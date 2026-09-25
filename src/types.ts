export type QuestionGroup = {
  id: string;
  name: string;
  accentColor: string;
};

export type Topic = {
  id: string;
  groupId: string;
  name: string;
  isDefault: boolean;
};
export type Question = {
  id: string;
  // Derived from the owning topic when adapting the API response for links and search.
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

export type LibraryGroup = QuestionGroup & {
  topics: (Topic & { questions: Omit<Question, 'groupId'>[] })[];
};

export type InterviewlyData = {
  groups: QuestionGroup[];
  topics: Topic[];
  questions: Question[];
};

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
