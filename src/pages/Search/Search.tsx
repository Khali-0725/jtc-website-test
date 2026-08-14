import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { SearchResult, SearchCategory } from '@/types';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { EmptyState } from '@/components/common/EmptyState';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { searchService } from '@/services/searchService';
import { useAsync, useDebounce } from '@/hooks';
import styles from './Search.module.css';

const categoryOrder: SearchCategory[] = ['Sermon', 'Event', 'Ministry', 'Page', 'Announcement'];

function group(results: SearchResult[]) {
  const map = new Map<SearchCategory, SearchResult[]>();
  results.forEach((r) => {
    const list = map.get(r.category) ?? [];
    list.push(r);
    map.set(r.category, list);
  });
  return categoryOrder
    .filter((c) => map.has(c))
    .map((c) => ({ category: c, items: map.get(c)! }));
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');
  const debounced = useDebounce(term, 300);
  const trimmed = debounced.trim();

  // Keep the URL in sync with the debounced query (replace, not push).
  useEffect(() => {
    const current = params.get('q') ?? '';
    if (current === debounced) return;
    const next = new URLSearchParams(params);
    if (debounced) next.set('q', debounced);
    else next.delete('q');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const state = useAsync(() => searchService.query(trimmed), [trimmed]);

  return (
    <>
      <SEO title="Search" description="Search across Jesus The Counselor Cavite." path="/search" noindex />
      <PageHero eyebrow="Explore" title="Search">
        <form className={styles.searchForm} role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-input" className="sr-only">
            Search the site
          </label>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <input
            id="search-input"
            type="search"
            className={styles.input}
            placeholder="Search sermons, events, ministries…"
            value={term}
            autoComplete="off"
            onChange={(e) => setTerm(e.target.value)}
          />
        </form>
      </PageHero>

      <section className="section">
        <Container size="wide">
          {!trimmed ? (
            <p className={styles.prompt}>Start typing to search across the site.</p>
          ) : (
            <AsyncBoundary
              state={state}
              loadingLabel="Searching…"
              empty={<EmptyState title="No results" message={`No results for "${trimmed}".`} />}
            >
              {(results) => (
                <div className={styles.groups}>
                  {group(results).map((g, gi) => (
                    <section key={g.category} className={styles.group}>
                      <h2 className={styles.groupTitle}>{g.category}s</h2>
                      <ul className={styles.list} role="list">
                        {g.items.map((item, i) => (
                          <AnimatedReveal as="li" key={item.id} delay={((gi + i) % 4) * 60}>
                            <Link to={item.url} className={styles.result}>
                              <span className={styles.resultCategory}>{item.category}</span>
                              <span className={styles.resultTitle}>{item.title}</span>
                              <span className={styles.resultExcerpt}>{item.excerpt}</span>
                            </Link>
                          </AnimatedReveal>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </AsyncBoundary>
          )}
        </Container>
      </section>
    </>
  );
}
