import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { mockShows } from '@/data/fixtures/shows';
import { WatchStub } from './watch-stub';

export function generateStaticParams() {
  return mockShows.map((show) => ({ showId: show.id }));
}

export default function WatchPage({ params }: { params: { showId: string } }) {
  const show = mockShows.find((candidate) => candidate.id === params.showId);

  if (!show) {
    notFound();
  }

  return (
    <Suspense fallback={<p data-testid="variant-b-watch-loading">Loading watch stub…</p>}>
      <WatchStub show={show} />
    </Suspense>
  );
}
