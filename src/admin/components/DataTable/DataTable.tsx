import type { ReactNode } from 'react';
import { Loading, EmptyState, ErrorState } from '@/components/common';
import { classNames } from '@/utils/helpers';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  /* Custom empty-state node; falls back to a default EmptyState. */
  empty?: ReactNode;
  /* Optional per-row action cell (edit/delete buttons, toggles…). */
  actions?: (row: T) => ReactNode;
  actionsLabel?: string;
  caption?: string;
}

/* Generic admin table with loading / error / empty handling.
   Column cells use `render` when provided, else read row[key]. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  empty,
  actions,
  actionsLabel = 'Actions',
  caption,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={styles.state}>
        <Loading label="Loading…" />
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.state}>
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }
  if (rows.length === 0) {
    return <div className={styles.state}>{empty ?? <EmptyState title="Nothing here yet" />}</div>;
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={classNames(styles.th, col.align && styles[col.align])}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th scope="col" className={classNames(styles.th, styles.right)}>
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={classNames(styles.td, col.align && styles[col.align])}>
                  {col.render ? col.render(row) : ((row as Record<string, ReactNode>)[col.key] ?? '—')}
                </td>
              ))}
              {actions && (
                <td className={classNames(styles.td, styles.right)}>
                  <div className={styles.actions}>{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
