import type { Question } from '@/entities/question';

export function filterQuestions(questions: Question[], query: string) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return questions;

    return questions.filter((question) => question.question.toLowerCase().includes(normalized));
}

export function groupQuestionsByTopic(questions: Question[]) {
    const questionsByTopic = new Map<string | null, Question[]>();

    for (const question of questions) {
        const topicQuestions = questionsByTopic.get(question.topicId) ?? [];
        topicQuestions.push(question);
        questionsByTopic.set(question.topicId, topicQuestions);
    }

    return questionsByTopic;
}
