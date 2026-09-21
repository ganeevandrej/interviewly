'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InterviewlyData, LibraryGroup, QuestionGroup, QuestionInput } from '@/types';
import { apiRequest, flattenLibrary } from '@/client/library';

const emptyData: InterviewlyData = { groups: [], topics: [], questions: [] };
const groupPath = (id: string) => '/api/groups/' + encodeURIComponent(id);

export const useInterviewlyStoreState = () => {
  const [data, setData] = useState<InterviewlyData>(emptyData);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const writing = useRef(false);
  const generation = useRef(0);

  const reload = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++generation.current;
    setLoading(true);
    try {
      const groups = await apiRequest<LibraryGroup[]>('/api/groups', 'GET', undefined, signal);
      if (requestId !== generation.current || signal?.aborted) return;
      setData(flattenLibrary(groups));
      setHydrated(true);
      setLoadError(null);
    } catch (error) {
      if (requestId === generation.current && !signal?.aborted) {
        setLoadError(error instanceof Error ? error.message : 'Не удалось загрузить данные.');
      }
    } finally {
      if (requestId === generation.current && !signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void reload(controller.signal);
    const refresh = () => {
      if (!writing.current) void reload(controller.signal);
    };
    window.addEventListener('focus', refresh);
    return () => {
      controller.abort();
      window.removeEventListener('focus', refresh);
    };
  }, [reload]);

  async function mutate(path: string, method: string, body?: unknown): Promise<void> {
    if (writing.current) throw new Error('Дождитесь завершения текущего сохранения.');
    writing.current = true;
    setPending(true);
    // A read started before the write must not replace its result.
    generation.current++;
    try {
      await apiRequest(path, method, body);
      // A successful write is not retried if only the subsequent refresh fails.
      await reload();
    } finally {
      writing.current = false;
      setPending(false);
      setLoading(false);
    }
  }
  const questionCountByGroup = useMemo(
    () =>
      data.questions.reduce<Record<string, number>>((counts, question) => {
        counts[question.groupId] = (counts[question.groupId] ?? 0) + 1;
        return counts;
      }, {}),
    [data.questions],
  );

  return {
    ...data,
    hydrated,
    loading,
    loadError,
    pending,
    reload,
    questionCountByGroup,
    createGroup: (input: Omit<QuestionGroup, 'id'>) => mutate('/api/groups', 'POST', input),
    updateGroup: (id: string, input: Omit<QuestionGroup, 'id'>) =>
      mutate(groupPath(id), 'PUT', input),
    deleteGroup: (id: string) => mutate(groupPath(id), 'DELETE'),
    createTopic: (groupId: string, name: string) =>
      mutate(groupPath(groupId) + '/topics', 'POST', { name }),
    renameTopic: (groupId: string, id: string, name: string) =>
      mutate(groupPath(groupId) + '/topics/' + encodeURIComponent(id), 'PUT', { name }),
    deleteTopic: (groupId: string, id: string) =>
      mutate(groupPath(groupId) + '/topics/' + encodeURIComponent(id), 'DELETE'),
    createQuestion: (input: QuestionInput & { groupId: string }) => {
      const { groupId, ...body } = input;
      return mutate(groupPath(groupId) + '/questions', 'POST', body);
    },
    updateQuestion: (groupId: string, id: string, input: QuestionInput) =>
      mutate(groupPath(groupId) + '/questions/' + encodeURIComponent(id), 'PUT', input),
    deleteQuestion: (groupId: string, id: string) =>
      mutate(groupPath(groupId) + '/questions/' + encodeURIComponent(id), 'DELETE'),
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
