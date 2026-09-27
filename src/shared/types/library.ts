import type { Question, QuestionInput } from '@/entities/question/model/types';
import type { QuestionGroup } from '@/entities/group/model/types';
import type { Topic } from '@/entities/topic/model/types';

export type LibraryGroup = QuestionGroup & {
    topics: (Topic & { questions: Omit<Question, 'groupId'>[] })[];
};

export type InterviewlyData = {
    groups: QuestionGroup[];
    topics: Topic[];
    questions: Question[];
};

export type { Question, QuestionGroup, QuestionInput, Topic };
export type {
    Project,
    ProjectInput,
    ProjectListItem,
    ProjectQuestion,
    ProjectStatus,
    ProjectStep,
    ProjectTeamItem,
    ProjectTechnology,
    ProjectTechnologyInput,
    Technology,
    ProjectTag,
} from '@/entities/project/model/types';
export type { Story, StoryInput, StoryQuestion, StoryTag } from '@/entities/story/model/types';
