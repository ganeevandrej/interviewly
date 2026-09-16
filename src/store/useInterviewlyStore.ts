'use client';

import { useEffect, useMemo, useState } from 'react';
import { InterviewlyData, Question, QuestionGroup } from '@/types';
import { loadInterviewlyData, saveInterviewlyData, seedData } from '@/storage/persistence';

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useInterviewlyStore = () => {
  const [data, setData] = useState<InterviewlyData>(seedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadInterviewlyData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveInterviewlyData(data);
  }, [data, hydrated]);

  const questionCountByGroup = useMemo(() => {
    return data.questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.groupId] = (acc[question.groupId] ?? 0) + 1;
      return acc;
    }, {});
  }, [data.questions]);

  const createGroup = (payload: Omit<QuestionGroup, 'id'>) => {
    setData((current) => ({
      ...current,
      groups: [...current.groups, { ...payload, id: createId('group') }]
    }));
  };

  const updateGroup = (id: string, payload: Omit<QuestionGroup, 'id'>) => {
    setData((current) => ({
      ...current,
      groups: current.groups.map((group) => (group.id === id ? { ...group, ...payload } : group))
    }));
  };

  const deleteGroup = (id: string) => {
    setData((current) => ({
      groups: current.groups.filter((group) => group.id !== id),
      questions: current.questions.filter((question) => question.groupId !== id)
    }));
  };

  const createQuestion = (payload: Omit<Question, 'id'>) => {
    const id = createId('question');
    setData((current) => ({
      ...current,
      questions: [...current.questions, { ...payload, id }]
    }));
    return id;
  };

  const updateQuestion = (id: string, payload: Omit<Question, 'id' | 'groupId'>) => {
    setData((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === id ? { ...question, ...payload } : question,
      )
    }));
  };

  const deleteQuestion = (id: string) => {
    setData((current) => ({
      ...current,
      questions: current.questions.filter((question) => question.id !== id)
    }));
  };

  return {
    ...data,
    hydrated,
    questionCountByGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    createQuestion,
    updateQuestion,
    deleteQuestion
  };
};
