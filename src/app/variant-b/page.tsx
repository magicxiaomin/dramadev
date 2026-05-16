import Link from 'next/link';
import { mockShows, PRIMARY_SHOW_ID } from '@/data/fixtures/shows';

export default function VariantBHomePage() {
  const primaryShow = mockShows.find((show) => show.id === PRIMARY_SHOW_ID) ?? mockShows[0];

  return (
    <section data-testid="variant-b-home" className="space-y-5">
      <p className="text-sm uppercase tracking-[0.3em] text-scene-muted">SceneFlow Variant B</p>
      <h1 className="text-3xl font-bold">Watch-first scaffold</h1>
      <p className="text-scene-muted">Route stub for the P0 Facebook ad conversion flow.</p>
      <div className="rounded-3xl bg-scene-card p-5" data-testid="featured-show-card">
        <p className="text-sm text-scene-muted">Featured fixture</p>
        <h2 className="mt-2 text-2xl font-semibold">{primaryShow.title}</h2>
        <p className="mt-2 text-sm text-scene-muted">{primaryShow.logline}</p>
        <Link className="mt-4 inline-block rounded-full bg-scene-accent px-4 py-2 text-sm font-semibold" href={`/variant-b/watch/${primaryShow.id}?episode=1&source=facebook`}>
          Open ad landing stub
        </Link>
      </div>
    </section>
  );
}
