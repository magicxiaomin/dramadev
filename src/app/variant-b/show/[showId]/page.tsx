import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { mockShows } from '@/data/fixtures/shows';
import { ShowStub } from './show-stub';

export function generateStaticParams() {
  return mockShows.map((show) => ({ showId: show.id }));
}

export default function ShowPage({ params }: { params: { showId: string } }) {
  const show = mockShows.find((candidate) => candidate.id === params.showId);

  if (!show) {
    notFound();
  }

  return (
    <Suspense fallback={<section className="space-y-4" data-testid="variant-b-show-loading">Loading show detail…</section>}>
      <ShowStub show={show} />
    </Suspense>
  );
}
