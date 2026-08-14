import type { Speaker, SermonSeries } from '@/types';
import styles from './SermonFilters.module.css';

interface SermonFiltersProps {
  search: string;
  speaker: string;
  series: string;
  speakers: Speaker[];
  seriesList: SermonSeries[];
  onSearch: (v: string) => void;
  onSpeaker: (v: string) => void;
  onSeries: (v: string) => void;
  onReset: () => void;
}

export function SermonFilters({
  search,
  speaker,
  series,
  speakers,
  seriesList,
  onSearch,
  onSpeaker,
  onSeries,
  onReset,
}: SermonFiltersProps) {
  const hasFilters = Boolean(search || speaker || series);

  return (
    <div className={styles.bar} role="search">
      <div className={styles.searchWrap}>
        <span className={styles.icon} aria-hidden="true">⌕</span>
        <input
          type="search"
          className={styles.input}
          placeholder="Search messages, speakers, scripture…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search sermons"
        />
      </div>

      <label className={styles.selectWrap}>
        <span className="sr-only">Filter by speaker</span>
        <select value={speaker} onChange={(e) => onSpeaker(e.target.value)} className={styles.select}>
          <option value="">All Speakers</option>
          {speakers.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.selectWrap}>
        <span className="sr-only">Filter by series</span>
        <select value={series} onChange={(e) => onSeries(e.target.value)} className={styles.select}>
          <option value="">All Series</option>
          {seriesList.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button type="button" className={styles.reset} onClick={onReset}>
          Clear
        </button>
      )}
    </div>
  );
}
