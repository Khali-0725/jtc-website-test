import { useCallback, useEffect, useRef, useState } from 'react';
import type { AsyncState } from '@/types';

/* ============================================================
   useAsync — generic async data hook with idle/loading/
   success/empty/error states. Powers the content hooks.
   ============================================================ */

type Fetcher<T> = () => Promise<T>;

function isEmpty(data: unknown): boolean {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object' && 'items' in (data as Record<string, unknown>)) {
    const items = (data as { items?: unknown[] }).items;
    return Array.isArray(items) && items.length === 0;
  }
  return false;
}

export function useAsync<T>(fetcher: Fetcher<T>, deps: unknown[] = []): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });
  const mounted = useRef(true);
  // Keep latest fetcher without forcing it into the dependency array.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    fetcherRef.current()
      .then((data) => {
        if (!mounted.current) return;
        setState({ data, status: isEmpty(data) ? 'empty' : 'success', error: null });
      })
      .catch((err: unknown) => {
        if (!mounted.current) return;
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        setState({ data: null, status: 'error', error: message });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { ...state, reload: run };
}
