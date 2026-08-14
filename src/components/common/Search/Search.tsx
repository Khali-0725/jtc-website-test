import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import type { SearchResult, SearchCategory } from '@/types';
import { searchService } from '@/services/searchService';
import { useDebounce } from '@/hooks/useDebounce';
import { Loading } from '../Loading';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';
import styles from './Search.module.css';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

const categoryOrder: SearchCategory[] = ['Sermon', 'Event', 'Ministry', 'Page', 'Announcement'];

export function Search({ isOpen, onClose }: SearchProps) {
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<SearchResult[]>([]);
  const debounced = useDebounce(term, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    let active = true;
    if (!debounced.trim()) {
      setStatus('idle');
      setResults([]);
      return;
    }
    setStatus('loading');
    searchService
      .query(debounced)
      .then((r) => {
        if (!active) return;
        setResults(r);
        setStatus('done');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [debounced]);

  const grouped = useMemo(() => {
    const map = new Map<SearchCategory, SearchResult[]>();
    results.forEach((r) => {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    });
    return categoryOrder.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c)! }));
  }, [results]);

  function go(url: string) {
    onClose();
    setTerm('');
    navigate(url);
  }

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Site search">
        <div className={styles.inputRow}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder="Search sermons, events, ministries…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search the site"
          />
          <button className={styles.esc} onClick={onClose}>Esc</button>
        </div>

        <div className={styles.results}>
          {status === 'idle' && (
            <p className={styles.hint}>Start typing to search across the site.</p>
          )}
          {status === 'loading' && <Loading label="Searching…" />}
          {status === 'error' && <ErrorState message="Search is unavailable right now." />}
          {status === 'done' && results.length === 0 && (
            <EmptyState title="No results" message={`We couldn't find anything for "${debounced}".`} />
          )}
          {status === 'done' &&
            grouped.map((group) => (
              <section key={group.category} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.category}s</h3>
                <ul className={styles.list} role="list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button className={styles.result} onClick={() => go(item.url)}>
                        <span className={styles.resultTitle}>{item.title}</span>
                        <span className={styles.resultExcerpt}>{item.excerpt}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
