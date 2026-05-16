'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { SceneFlowShow } from '@/types/scene-flow';
import { buildWatchEpisodeHref, parseWatchQueryParams, type QueryParams } from '@/lib/query-params';

function paramsFromSearch(searchParams: URLSearchParams): QueryParams {
  return Object.fromEntries(searchParams.entries());
}

export function ShowStub({ show }: { show: SceneFlowShow }) {
  const searchParams = useSearchParams();
  const query = parseWatchQueryParams(paramsFromSearch(searchParams), show.totalEpisodes);
  const watchHref = buildWatchEpisodeHref({ showId: show.id, episode: query.episode, attribution: query.attribution });

  return (
    <section data-testid="variant-b-show" className="space-y-4">
      <p className="text-sm uppercase tracking-[0.3em] text-scene-muted">Show detail stub</p>
      <h1 className="text-3xl font-bold">{show.title}</h1>
      <p className="text-scene-muted">{show.synopsis}</p>
      <p data-testid="show-free-episodes">Free episodes: {show.freeEpisodes}</p>
      <p className="rounded-2xl bg-scene-card p-3 text-xs text-white/70" data-testid="show-roundtrip-context">
        Round trip: returns to EP {query.episode} with source {query.attribution.source ?? 'none'}.
      </p>
      <Link className="inline-block rounded-full bg-scene-accent px-4 py-2 text-sm font-semibold text-scene-bg" href={watchHref} data-testid="show-watch-return-link">
        Watch EP {query.episode}
      </Link>
    </section>
  );
}
