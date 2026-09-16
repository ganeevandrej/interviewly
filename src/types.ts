export type QuestionGroup = {
  id: string;
  name: string;
  accentColor: string;
};

export type Question = {
  id: string;
  groupId: string;
  question: string;
  answer: string;
};

export type InterviewlyData = {
  groups: QuestionGroup[];
  questions: Question[];
};
