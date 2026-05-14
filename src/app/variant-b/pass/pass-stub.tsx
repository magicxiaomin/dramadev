'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mockShows, PRIMARY_SHOW_ID } from '@/data/fixtures/shows';
import { buildPassReturnHref, buildWatchEpisodeHref, parsePassQueryParams, type QueryParams } from '@/lib/query-params';

function paramsFromSearch(searchParams: URLSearchParams): QueryParams {
  return Object.fromEntries(searchParams.entries());
}

export function PassStub() {
  const searchParams = useSearchParams();
  const rawParams = paramsFromSearch(searchParams);
  const storyId = typeof rawParams.story === 'string' ? rawParams.story : PRIMARY_SHOW_ID;
  const show = mockShows.find((candidate) => candidate.id === storyId) ?? mockShows[0];
  const query = parsePassQueryParams(rawParams, show.totalEpisodes);
  const episode = show.episodes.find((candidate) => candidate.episodeNumber === query.episode);
  const returnHref = buildPassReturnHref({ showId: show.id, episode: query.episode, attribution: query.attribution });
  const backToWatchHref = buildWatchEpisodeHref({ showId: show.id, episode: query.episode, attribution: query.attribution });

  return (
    <section data-testid="variant-b-pass" className="space-y-4">
      <p className="text-sm uppercase tracking-[0.3em] text-scene-muted">Mock Story Pass</p>
      <h1 className="text-3xl font-bold">Keep watching {show.title}</h1>
      <p className="text-scene-muted">
        Story-focused P0 pass stub for EP {query.episode}. This is a local mock purchase surface only; it never creates a real payment, subscription, login, or entitlement.
      </p>

      <Link className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/86" href={backToWatchHref} data-testid="pass-back-watch-link">
        Back to Watch · EP {query.episode}
      </Link>

      <div className="rounded-3xl bg-scene-card p-5" data-testid="pass-current-drama-card">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-scene-accent">Current drama</p>
        <h2 className="mt-2 text-2xl font-black" data-testid="pass-story">
          {show.title}
        </h2>
        <p className="mt-2 text-sm text-white/70" data-testid="pass-episode">
          Stuck on EP {query.episode} · {episode?.title ?? 'fixture episode'}
        </p>
        <p className="mt-3 text-sm leading-6 text-white/74" data-testid="pass-story-hook">
          {episode?.storyHook ?? show.logline}
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="rounded-3xl bg-scene-card p-4" data-testid="pass-single-episode-option">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-scene-accent">Unlock option</p>
          <h3 className="mt-2 text-xl font-black">Unlock EP {query.episode}</h3>
          <p className="mt-1 text-white/72">Cost: {show.mockCostPerEpisode} coins. Returns to this exact episode with unlocked=1.</p>
        </div>

        <div className="rounded-3xl bg-scene-card p-4" data-testid="pass-story-pass-option">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-scene-accent">Story Pass option</p>
          <h3 className="mt-2 text-xl font-black">Mock Story Pass · 120 coins</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-white/72">
            <li>Unlocks this story fixture in the prototype only.</li>
            <li>Not a subscription and does not auto-renew.</li>
            <li>Cancellation and renewal controls are placeholders for future production design.</li>
          </ul>
        </div>

        <div className="rounded-3xl bg-scene-card p-4" data-testid="pass-coin-pack-option">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-scene-accent">Coin pack placeholder</p>
          <h3 className="mt-2 text-xl font-black">Mock coin pack</h3>
          <p className="mt-1 text-white/72">Local price, tax, cancellation, renewal, and refund copy are transparent placeholders. No processor is connected.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.08] p-3 text-xs leading-5 text-white/68" data-testid="pass-disclaimer">
        <p className="font-bold text-white/82">Trust and mock status</p>
        <p>
          No real subscription, payment, login, backend, entitlement, analytics, Facebook API, or database is connected. The CTA below simulates a successful Story Pass and preserves safe attribution context back to EP {query.episode}.
        </p>
      </div>

      <Link className="block rounded-full bg-scene-accent px-5 py-3 text-center text-sm font-black text-scene-bg" href={returnHref} data-testid="pass-mock-return-link">
        Mock get Story Pass · return to EP {query.episode}
      </Link>
    </section>
  );
}
