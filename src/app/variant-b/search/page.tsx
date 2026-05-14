import { mockShows } from '@/data/fixtures/shows';

export default function SearchPage() {
  return (
    <section data-testid="variant-b-search" className="space-y-4">
      <p className="text-sm uppercase tracking-[0.3em] text-scene-muted">Search stub</p>
      <h1 className="text-3xl font-bold">Search</h1>
      <p className="text-scene-muted">Static route placeholder with fixture-backed results.</p>
      <ul className="space-y-3">
        {mockShows.map((show) => (
          <li key={show.id} className="rounded-2xl bg-scene-card p-4" data-testid="search-result">
            <strong>{show.title}</strong>
            <p className="text-sm text-scene-muted">{show.genreTags.join(' • ')}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
