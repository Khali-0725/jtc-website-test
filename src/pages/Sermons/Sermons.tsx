import { useMemo, useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { SermonCard, SermonFilters } from '@/components/sermons';
import { useSermons, useSermonFilters, useDebounce } from '@/hooks';
import { SERMON_PAGE_SIZE } from '@/data/constants';
import styles from './Sermons.module.css';

export default function SermonsPage() {
  const [search, setSearch] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [series, setSeries] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      speaker: speaker || undefined,
      series: series || undefined,
      page,
      pageSize: SERMON_PAGE_SIZE,
    }),
    [debouncedSearch, speaker, series, page],
  );

  const state = useSermons(query);
  const { speakers, series: seriesState } = useSermonFilters();

  function reset() {
    setSearch('');
    setSpeaker('');
    setSeries('');
    setPage(1);
  }

  return (
    <>
      <SEO title="Sermons" description="Watch and listen to messages from Jesus The Counselor Cavite." path="/sermons" />
      <PageHero
        eyebrow="Messages"
        title="Sermons"
        description="Be encouraged and equipped by the Word. Browse our latest messages and series."
      />

      <section className="section">
        <Container size="wide">
          <SermonFilters
            search={search}
            speaker={speaker}
            series={series}
            speakers={speakers.data ?? []}
            seriesList={seriesState.data ?? []}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            onSpeaker={(v) => {
              setSpeaker(v);
              setPage(1);
            }}
            onSeries={(v) => {
              setSeries(v);
              setPage(1);
            }}
            onReset={reset}
          />

          <div className={styles.results}>
            <AsyncBoundary
              state={state}
              loadingLabel="Loading sermons…"
              empty={
                <EmptyState
                  title="No sermons found"
                  message="Try adjusting your search or filters."
                  action={
                    <Button variant="outline" size="sm" onClick={reset}>
                      Clear filters
                    </Button>
                  }
                />
              }
            >
              {(result) => (
                <>
                  <div className={styles.grid}>
                    {result.items.map((sermon, i) => (
                      <AnimatedReveal key={sermon.id} delay={(i % 3) * 80}>
                        <SermonCard sermon={sermon} />
                      </AnimatedReveal>
                    ))}
                  </div>
                  <Pagination
                    page={result.page}
                    pageSize={result.pageSize}
                    total={result.total}
                    onPageChange={setPage}
                  />
                </>
              )}
            </AsyncBoundary>
          </div>
        </Container>
      </section>
    </>
  );
}
