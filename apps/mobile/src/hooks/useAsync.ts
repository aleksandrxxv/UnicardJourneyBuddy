import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading'; data?: T }
  | { status: 'error'; data?: T; error: Error }
  | { status: 'success'; data: T };

/** Runs an async loader, exposing its state and a reload function. Keeps old data while reloading. */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  const run = useCallback(loader, deps);

  const reload = useCallback(() => {
    setState((s) => ({ status: 'loading', data: s.data }));
    run().then(
      (data) => setState({ status: 'success', data }),
      (error: Error) => setState((s) => ({ status: 'error', data: s.data, error })),
    );
  }, [run]);

  useEffect(reload, [reload]);

  return { ...state, reload };
}
