export type QuestionGroup = { id: string; name: string; accentColor: string };
export type Topic = { id: string; groupId: string; name: string; isDefault: boolean };
export type Question = {
  id: string;
  // Derived from the owning topic when adapting the API response for links and search.
  groupId: string;
  topicId: string;
  position: number;
  question: string;
  answer: string;
};
export type QuestionInput = { topicId: string | null; question: string; answer: string };
export type LibraryGroup = QuestionGroup & {
  topics: (Topic & { questions: Omit<Question, 'groupId'>[] })[];
};
export type InterviewlyData = { groups: QuestionGroup[]; topics: Topic[]; questions: Question[] };
