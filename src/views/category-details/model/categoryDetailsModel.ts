import type { CategoryLibrary, CategoryQuestion } from '@/entities/category';

export function questionFromLibrary(library: CategoryLibrary): CategoryQuestion[] {
    const topicByQuestionId = new Map(
        library.topicQuestions.map((link) => [link.questionId, link.topicId]),
    );

    const positionByQuestionId = new Map(
        library.categoryQuestions.map((link) => [link.questionId, link.position]),
    );

    return library.questions
        .map((question) => ({
            ...question,
            categoryId: library.category.id,
            topicId: topicByQuestionId.get(question.id) ?? null,
            position: positionByQuestionId.get(question.id) ?? 0,
        }))
        .toSorted((left, right) => left.position - right.position);
}

export function updateLibraryQuestion(
    library: CategoryLibrary,
    question: CategoryQuestion,
): CategoryLibrary {
    const questions = library.questions.some((item) => item.id === question.id)
        ? library.questions.map((item) =>
              item.id === question.id
                  ? { id: question.id, question: question.question, answer: question.answer }
                  : item,
          )
        : [
              ...library.questions,
              { id: question.id, question: question.question, answer: question.answer },
          ];

    const categoryQuestions = library.categoryQuestions.some(
        (item) => item.questionId === question.id,
    )
        ? library.categoryQuestions
        : [
              ...library.categoryQuestions,
              {
                  categoryId: question.categoryId,
                  questionId: question.id,
                  position: question.position,
              },
          ];

    const withoutQuestion = library.topicQuestions.filter(
        (item) => item.questionId !== question.id,
    );

    const topicQuestions = question.topicId
        ? [
              ...withoutQuestion,
              {
                  topicId: question.topicId,
                  questionId: question.id,
                  position: question.topicPosition ?? 0,
              },
          ]
        : withoutQuestion;

    return { ...library, questions, categoryQuestions, topicQuestions };
}
