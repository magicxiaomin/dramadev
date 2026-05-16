import { mockShows } from '@/data/fixtures/shows';

export default function BrowsePage() {
  const tags = Array.from(new Set(mockShows.flatMap((show) => show.genreTags)));

  return (
    <section data-testid="variant-b-browse" className="space-y-4">
      <p className="text-sm uppercase tracking-[0.3em] text-scene-muted">Browse stub</p>
      <h1 className="text-3xl font-bold">Browse</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-scene-card px-3 py-2 text-sm" data-testid="browse-tag">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
