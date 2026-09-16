'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { InterviewlyData, Question, QuestionGroup } from '@/types';
import { loadInterviewlyData, saveInterviewlyData, seedData } from '@/storage/persistence';

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useInterviewlyStoreState = () => {
  const [data, setData] = useState<InterviewlyData>(seedData);
  const [hydrated, setHydrated] = useState(false);

  const lastSavedData = useRef(data);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const loaded = loadInterviewlyData();
    lastSavedData.current = loaded;
    setData(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || data === lastSavedData.current) return;
    const saved = saveInterviewlyData(data);
    setStorageError(!saved);
    if (saved) lastSavedData.current = data;
  }, [data, hydrated]);

  const questionCountByGroup = useMemo(() => {
    return data.questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.groupId] = (acc[question.groupId] ?? 0) + 1;
      return acc;
    }, {});
  }, [data.questions]);

  const createGroup = (payload: Omit<QuestionGroup, 'id'>) => {
    const id = createId('group');
    setData((current) => ({
      ...current,
      groups: [...current.groups, { ...payload, id }],
    }));
  };

  const updateGroup = (id: string, payload: Omit<QuestionGroup, 'id'>) => {
    setData((current) => ({
      ...current,
      groups: current.groups.map((group) => (group.id === id ? { ...group, ...payload } : group)),
    }));
  };

  const deleteGroup = (id: string) => {
    setData((current) => ({
      groups: current.groups.filter((group) => group.id !== id),
      questions: current.questions.filter((question) => question.groupId !== id),
    }));
  };

  const createQuestion = (payload: Omit<Question, 'id'>) => {
    const id = createId('question');
    setData((current) => ({
      ...current,
      questions: [...current.questions, { ...payload, id }],
    }));
    return id;
  };

  const updateQuestion = (id: string, payload: Omit<Question, 'id' | 'groupId'>) => {
    setData((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === id ? { ...question, ...payload } : question,
      ),
    }));
  };

  const deleteQuestion = (id: string) => {
    setData((current) => ({
      ...current,
      questions: current.questions.filter((question) => question.id !== id),
    }));
  };

  return {
    ...data,
    hydrated,
    storageError,
    questionCountByGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
};

export const InterviewlyStoreContext = createContext<ReturnType<
  typeof useInterviewlyStoreState
> | null>(null);

export const useInterviewlyStore = () => {
  const store = useContext(InterviewlyStoreContext);
  if (!store) throw new Error('useInterviewlyStore requires InterviewlyStoreProvider');
  return store;
};
