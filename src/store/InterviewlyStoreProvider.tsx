'use client';

import { ReactNode } from 'react';
import { InterviewlyStoreContext, useInterviewlyStoreState } from './useInterviewlyStore';

export function InterviewlyStoreProvider({ children }: { children: ReactNode }) {
  const store = useInterviewlyStoreState();

  return (
    <InterviewlyStoreContext.Provider value={store}>
      {store.storageError && (
        <div role="alert">
          Не удалось сохранить изменения в браузере. Они доступны до перезагрузки страницы.
        </div>
      )}
      {store.hydrated ? children : <div role="status">Загрузка…</div>}
    </InterviewlyStoreContext.Provider>
  );
}
