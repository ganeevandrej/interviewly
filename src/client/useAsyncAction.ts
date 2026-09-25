'use client';
import { useRef, useState } from 'react';

// Shared by forms and destructive actions: catch errors and guard even same-tick double clicks.
export function useAsyncAction() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>): Promise<boolean> {
    if (running.current) return false;

    running.current = true;
    setBusy(true);
    setError(null);

    try {
      await action();

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не удалось сохранить изменения.');

      return false;
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return { busy, error, run, clearError: () => setError(null) };
}
