export type QuestionGroup = {
  id: string;
  name: string;
  accentColor: string;
};

export type Question = {
  id: string;
  groupId: string;
  categoryId: string | null;
  question: string;
  answer: string;
};

export type Category = { id: string; name: string };

export type GroupCategory = { groupId: string; categoryId: string };

export type InterviewlyData = {
  categories: Category[];
  groupCategories: GroupCategory[];
  groups: QuestionGroup[];
  questions: Question[];
};
