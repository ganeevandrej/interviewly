'use client';
import { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { InterviewlyStoreContext, useInterviewlyStoreState } from './useInterviewlyStore';

export function InterviewlyStoreProvider({ children }: { children: ReactNode }) {
  const store = useInterviewlyStoreState();
  return (
    <InterviewlyStoreContext.Provider value={store}>
      {store.loadError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              disabled={store.loading || store.pending}
              onClick={() => void store.reload()}
            >
              Повторить загрузку
            </Button>
          }
        >
          {store.hydrated
            ? 'Не удалось обновить список. Сохранённые изменения могут ещё не отображаться. '
            : ''}
          {store.loadError}
        </Alert>
      )}
      {!store.hydrated ? (
        store.loading ? (
          <Stack role="status" aria-live="polite" gap={2} sx={{ p: 4 }}>
            Загрузка данных…
            <LinearProgress />
          </Stack>
        ) : null
      ) : (
        children
      )}
    </InterviewlyStoreContext.Provider>
  );
}
