import type { ReactNode } from 'react';
import type { AsyncState } from '@/types';
import { Loading } from '../Loading';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';

interface AsyncBoundaryProps<T> {
  state: AsyncState<T> & { reload?: () => void };
  children: (data: T) => ReactNode;
  loading?: ReactNode;
  empty?: ReactNode;
  loadingLabel?: string;
}

/* Renders the correct UI for each async status. Keeps pages clean:
   <AsyncBoundary state={x}>{(data) => ...}</AsyncBoundary> */
export function AsyncBoundary<T>({
  state,
  children,
  loading,
  empty,
  loadingLabel,
}: AsyncBoundaryProps<T>) {
  if (state.status === 'loading' || state.status === 'idle') {
    return <>{loading ?? <Loading label={loadingLabel} />}</>;
  }
  if (state.status === 'error') {
    return <ErrorState message={state.error ?? undefined} onRetry={state.reload} />;
  }
  if (state.status === 'empty' || state.data == null) {
    return <>{empty ?? <EmptyState />}</>;
  }
  return <>{children(state.data)}</>;
}
