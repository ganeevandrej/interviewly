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
      ...current,
      groupCategories: current.groupCategories.filter((link) => link.groupId !== id),
      groups: current.groups.filter((group) => group.id !== id),
      questions: current.questions.filter((question) => question.groupId !== id),
    }));
  };

  const createQuestion = (payload: Omit<Question, 'id'>) => {
    const id = createId('question');
    setData((current) => ({
      ...current,
      questions:
        current.groups.some((g) => g.id === payload.groupId) &&
        (payload.categoryId === null ||
          current.groupCategories.some(
            (link) => link.groupId === payload.groupId && link.categoryId === payload.categoryId,
          ))
          ? [...current.questions, { ...payload, id }]
          : current.questions,
    }));
    return id;
  };

  const updateQuestion = (id: string, payload: Omit<Question, 'id' | 'groupId'>) => {
    setData((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === id &&
        (payload.categoryId === null ||
          current.groupCategories.some(
            (link) => link.groupId === question.groupId && link.categoryId === payload.categoryId,
          ))
          ? { ...question, ...payload }
          : question,
      ),
    }));
  };

  const deleteQuestion = (id: string) => {
    setData((current) => ({
      ...current,
      questions: current.questions.filter((question) => question.id !== id),
    }));
  };

  const createCategory = (name: string, groupId?: string) => {
    const id = createId('category');
    if (!name.trim()) return;
    setData((current) => ({
      ...current,
      categories: [...current.categories, { id, name: name.trim() }],
      groupCategories:
        groupId && current.groups.some((g) => g.id === groupId)
          ? [...current.groupCategories, { groupId, categoryId: id }]
          : current.groupCategories,
    }));
  };

  const renameCategory = (id: string, name: string) => {
    if (!name.trim()) return;
    setData((current) => ({
      ...current,
      categories: current.categories.map((c) => (c.id === id ? { ...c, name: name.trim() } : c)),
    }));
  };

  const addCategoryToGroup = (groupId: string, categoryId: string) => {
    setData((current) => {
      if (
        !current.groups.some((g) => g.id === groupId) ||
        !current.categories.some((c) => c.id === categoryId) ||
        current.groupCategories.some(
          (link) => link.groupId === groupId && link.categoryId === categoryId,
        )
      )
        return current;
      return { ...current, groupCategories: [...current.groupCategories, { groupId, categoryId }] };
    });
  };

  const removeCategoryFromGroup = (groupId: string, categoryId: string) => {
    setData((current) => ({
      ...current,
      groupCategories: current.groupCategories.filter(
        (link) => link.groupId !== groupId || link.categoryId !== categoryId,
      ),
      questions: current.questions.map((q) =>
        q.groupId === groupId && q.categoryId === categoryId ? { ...q, categoryId: null } : q,
      ),
    }));
  };

  const deleteCategory = (id: string) => {
    setData((current) => ({
      ...current,
      categories: current.categories.filter((c) => c.id !== id),
      groupCategories: current.groupCategories.filter((link) => link.categoryId !== id),
      questions: current.questions.map((q) =>
        q.categoryId === id ? { ...q, categoryId: null } : q,
      ),
    }));
  };

  return {
    ...data,
    createCategory,
    renameCategory,
    addCategoryToGroup,
    removeCategoryFromGroup,
    deleteCategory,
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
