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

export type ProjectStatus = 'DRAFT' | 'READY';

export type ProjectTeamItem = { name: string; count: number };

export type Technology = { id: string; name: string };

export type ProjectTechnology = Technology & { isFeatured: boolean };

export type ProjectTechnologyInput = {
  id?: string;
  name?: string;
  isFeatured: boolean;
};

export type ProjectQuestion = { id: string; question: string; answer: string };

export type Project = {
  id: string;
  title: string;
  color: string;
  description: string | null;
  team: ProjectTeamItem[];
  tasks: string[];
  responsibilities: string[];
  achievements: string[];
  status: ProjectStatus;
  technologies: ProjectTechnology[];
  questions: ProjectQuestion[];
  tag: StoryTag | null;
  histories: Story[];
};

export type ProjectListItem = Pick<Project, 'id' | 'title' | 'color' | 'status' | 'technologies'>;

export type ProjectInput = Omit<
  Project,
  'id' | 'status' | 'technologies' | 'questions' | 'tag' | 'histories'
> & {
  status?: ProjectStatus;
  technologies?: ProjectTechnologyInput[];
};

export type ProjectStep =
  | 'title-color'
  | 'description'
  | 'team'
  | 'technologies'
  | 'tasks'
  | 'responsibilities'
  | 'achievements';
