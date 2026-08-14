import styles from './Loading.module.css';

interface LoadingProps {
  label?: string;
  fullscreen?: boolean;
}

export function Loading({ label = 'Loading…', fullscreen }: LoadingProps) {
  return (
    <div className={fullscreen ? styles.fullscreen : styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

/* Skeleton block for content placeholders */
export function Skeleton({ height = 200, radius = 16 }: { height?: number; radius?: number }) {
  return (
    <span
      className={styles.skeleton}
      style={{ height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
