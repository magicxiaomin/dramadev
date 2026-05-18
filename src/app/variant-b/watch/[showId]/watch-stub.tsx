'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SceneFlowShow } from '@/types/scene-flow';
import { formatMockDrawerBalanceLabel, formatMockDrawerCostLabel } from '@/lib/drawer-mock-balance';
import { buildEpisodeSheetItems } from '@/lib/episode-sheet';
import { findEpisodeRange } from '@/lib/episode-range';
import { getEpisodeLockState } from '@/lib/lock';
import { buildPassHref, buildShowDetailHref, buildWatchEpisodeHref, parseWatchQueryParams, type QueryParams } from '@/lib/query-params';

function paramsFromSearch(searchParams: URLSearchParams): QueryParams {
  return Object.fromEntries(searchParams.entries());
}

function formatAttribution(attribution: Record<string, string | undefined>): string {
  const entries = Object.entries(attribution).filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (entries.length === 0) {
    return 'none';
  }

  return entries.map(([key, value]) => `${key}=${value}`).join(' · ');
}

export function WatchStub({ show }: { show: SceneFlowShow }) {
  const searchParams = useSearchParams();
  const query = parseWatchQueryParams(paramsFromSearch(searchParams), show.totalEpisodes);
  const episode = show.episodes.find((candidate) => candidate.episodeNumber === query.episode);
  const lockState = getEpisodeLockState({
    episode: query.episode,
    freeEpisodes: show.freeEpisodes,
    unlocked: query.unlocked,
  });
  const range = findEpisodeRange(show.episodeRanges, query.episode);
  const currentRangeLabel = range?.label ?? show.episodeRanges[0]?.label;
  const [isPlaying, setIsPlaying] = useState(lockState !== 'locked');
  const [isComplete, setIsComplete] = useState(false);
  const [isUnlockDrawerOpen, setIsUnlockDrawerOpen] = useState(lockState === 'locked');
  const [isEpisodeSheetOpen, setIsEpisodeSheetOpen] = useState(false);
  const [activeRangeLabel, setActiveRangeLabel] = useState(currentRangeLabel);
  const unlockHref = buildWatchEpisodeHref({
    showId: show.id,
    episode: query.episode,
    attribution: query.attribution,
    unlocked: true,
  });
  const passHref = buildPassHref({ showId: show.id, episode: query.episode, attribution: query.attribution });
  const hasEnoughCoins = show.mockBalance >= show.mockCostPerEpisode;
  const nextEpisode = query.episode < show.totalEpisodes ? query.episode + 1 : undefined;
  const continueHref = nextEpisode
    ? buildWatchEpisodeHref({ showId: show.id, episode: nextEpisode, attribution: query.attribution })
    : undefined;
  const detailHref = buildShowDetailHref({ showId: show.id, episode: query.episode, attribution: query.attribution });
  const episodeSheetItems = buildEpisodeSheetItems({
    show,
    currentEpisode: query.episode,
    unlockedEpisode: query.unlocked ? query.episode : undefined,
  });
  const activeRange = show.episodeRanges.find((candidate) => candidate.label === activeRangeLabel) ?? range ?? show.episodeRanges[0];
  const visibleEpisodeSheetItems = activeRange
    ? episodeSheetItems.filter((item) => item.episode >= activeRange.start && item.episode <= activeRange.end)
    : episodeSheetItems;
  const progressValue = useMemo(() => {
    if (lockState === 'locked') {
      return 0;
    }

    if (isComplete) {
      return 100;
    }

    return isPlaying ? 62 : 24;
  }, [isComplete, isPlaying, lockState]);
  const stateLabel = lockState === 'locked' ? 'Locked placeholder' : isComplete ? 'Episode complete' : isPlaying ? 'Playing free preview' : 'Paused';
  const allTags = [...show.genreTags, ...show.tropeTags];

  useEffect(() => {
    setIsPlaying(lockState !== 'locked');
    setIsComplete(false);
    setIsUnlockDrawerOpen(lockState === 'locked');
    setActiveRangeLabel(currentRangeLabel);
  }, [currentRangeLabel, lockState, query.episode]);

  return (
    <section data-testid="variant-b-watch" className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col gap-4 px-4 pb-8 pt-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-scene-muted">Facebook ad watch landing</p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold leading-tight">{show.title}</h1>
            <p className="mt-1 text-sm text-scene-muted" data-testid="current-episode">
              EP {query.episode} · {episode?.title ?? 'Fixture episode placeholder'}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold" data-testid="watch-lock-state">
            {lockState}
          </span>
        </div>
      </header>

      <div
        className="relative flex aspect-[9/16] min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 p-5 shadow-2xl shadow-black/40"
        data-testid="vertical-playback-placeholder"
        style={{ background: `linear-gradient(160deg, ${show.posterColor}, #070712 70%)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
        <div className="relative z-10 flex w-full flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            <span>{range?.label ?? 'range pending'}</span>
            <span>{stateLabel}</span>
          </div>

          {lockState === 'locked' ? (
            <div className="rounded-[1.5rem] border border-white/15 bg-black/45 p-5 text-center backdrop-blur" data-testid="locked-boundary-placeholder">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-scene-accent">Locked boundary</p>
              <h2 className="mt-3 text-3xl font-black">EP {query.episode} is locked</h2>
              <p className="mt-3 text-sm leading-6 text-white/76">
                {episode?.storyHook ?? 'The next episode is intentionally held for the PHASE1-008 unlock drawer hand-off.'}
              </p>
              <p className="mt-4 rounded-2xl bg-white/10 p-3 text-xs text-white/70">
                Unlock stays on {show.title} EP {query.episode}; no login, payment, backend, or entitlement is connected.
              </p>
              <button
                className="mt-4 w-full rounded-full bg-scene-accent px-5 py-3 text-sm font-black text-scene-bg"
                type="button"
                onClick={() => setIsUnlockDrawerOpen(true)}
                data-testid="open-unlock-drawer"
              >
                Open Unlock Drawer
              </button>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-white/15 bg-black/35 p-5 backdrop-blur" data-testid="free-playback-state">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-scene-accent">
                {lockState === 'unlocked' ? 'Mock unlocked episode' : `Free preview · EP 1-${show.freeEpisodes}`}
              </p>
              <h2 className="mt-3 text-4xl font-black leading-none">EP {query.episode}</h2>
              <p className="mt-3 text-base text-white/82">{episode?.title ?? 'Original short-drama fixture episode'}</p>
              {query.unlocked ? <p className="mt-3 text-sm text-emerald-200">EP {query.episode} unlocked. Continue watching.</p> : null}
            </div>
          )}

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-white/20" aria-label="Mock playback progress">
              <div className="h-full rounded-full bg-scene-accent transition-all" style={{ width: `${progressValue}%` }} />
            </div>
            <div className="flex items-center justify-between gap-3">
              {lockState === 'locked' ? (
                <button
                  className="flex-1 rounded-full bg-white/12 px-5 py-3 text-sm font-bold text-white/75"
                  type="button"
                  onClick={() => setIsUnlockDrawerOpen(true)}
                  data-testid="locked-playback-reopen-drawer"
                >
                  Playback paused · unlock EP {query.episode}
                </button>
              ) : (
                <button
                  className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-bold text-scene-bg"
                  type="button"
                  onClick={() => setIsPlaying((current) => !current)}
                  data-testid="play-pause-toggle"
                >
                  {isPlaying ? 'Pause' : 'Play'} mock episode
                </button>
              )}
              {lockState !== 'locked' ? (
                <button
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold"
                  type="button"
                  onClick={() => {
                    setIsComplete(true);
                    setIsPlaying(false);
                  }}
                  data-testid="complete-episode-button"
                >
                  Complete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isComplete && continueHref ? (
        <Link
          className="block rounded-[1.5rem] bg-scene-accent px-5 py-4 text-center text-base font-black text-scene-bg"
          href={continueHref}
          data-testid="continue-next-episode"
        >
          Continue to EP {nextEpisode}
        </Link>
      ) : null}

      <div className="flex flex-wrap gap-2" aria-label="Genre and trope tags">
        {allTags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-scene-card px-3 py-1 text-xs text-white/82">
            {tag}
          </span>
        ))}
      </div>

      <nav className="grid grid-cols-3 gap-2 text-center text-xs font-semibold" aria-label="Watch page quick entries">
        <Link className="rounded-2xl bg-scene-card p-3" href={detailHref} data-testid="detail-entry">
          Detail
        </Link>
        <button className="rounded-2xl bg-scene-card p-3" type="button" onClick={() => setIsEpisodeSheetOpen(true)} data-testid="episode-list-entry">
          Episodes {range?.label ?? '1+'}
        </button>
        <span className="rounded-2xl bg-scene-card p-3" data-testid="share-entry">
          Share stub
        </span>
      </nav>

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-2xl bg-scene-card p-3" data-testid="watch-attribution-source">
          <dt className="text-scene-muted">Source</dt>
          <dd className="mt-1 font-semibold">{query.attribution.source ?? 'none'}</dd>
        </div>
        <div className="rounded-2xl bg-scene-card p-3" data-testid="watch-unlocked-flag">
          <dt className="text-scene-muted">Unlocked</dt>
          <dd className="mt-1 font-semibold">{query.unlocked ? 'yes' : 'no'}</dd>
        </div>
        <div className="col-span-2 rounded-2xl bg-scene-card p-3" data-testid="watch-route-metadata">
          <dt className="text-scene-muted">Route metadata</dt>
          <dd className="mt-1 break-words font-semibold">
            show={show.id} · episode={query.episode} · attribution={formatAttribution(query.attribution)}
          </dd>
        </div>
      </dl>

      {isEpisodeSheetOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-20 mx-auto max-h-[78vh] max-w-[430px] overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#151522]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur"
          data-testid="episode-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="episode-sheet-title"
        >
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-scene-accent">Episode Sheet</p>
              <h2 id="episode-sheet-title" className="mt-2 text-2xl font-black">
                {show.title}
              </h2>
              <p className="mt-2 text-sm text-white/70" data-testid="episode-sheet-summary">
                {show.totalEpisodes} episodes · EP 1-{show.freeEpisodes} free · current EP {query.episode}
              </p>
            </div>
            <button className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold" type="button" onClick={() => setIsEpisodeSheetOpen(false)}>
              Close
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto" aria-label="Episode ranges">
            {show.episodeRanges.map((episodeRange) => (
              <button
                className={`rounded-full px-4 py-2 text-xs font-bold ${episodeRange.label === activeRange?.label ? 'bg-scene-accent text-scene-bg' : 'bg-white/10 text-white/78'}`}
                key={episodeRange.label}
                type="button"
                onClick={() => setActiveRangeLabel(episodeRange.label)}
                data-testid={`episode-range-${episodeRange.label}`}
              >
                {episodeRange.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2" data-testid="episode-sheet-grid">
            {visibleEpisodeSheetItems.map((item) => {
              const href = buildWatchEpisodeHref({ showId: show.id, episode: item.episode, attribution: query.attribution });
              const stateClass =
                item.state === 'locked'
                  ? 'border-white/15 bg-white/[0.06] text-white/76'
                  : item.state === 'unlocked'
                    ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                    : 'border-scene-accent/30 bg-scene-accent/12 text-white';

              return (
                <Link
                  className={`rounded-2xl border p-3 text-left ${stateClass} ${item.isCurrent ? 'ring-2 ring-scene-accent' : ''}`}
                  href={href}
                  key={item.episode}
                  onClick={() => {
                    setIsEpisodeSheetOpen(false);
                    if (item.state === 'locked') {
                      setIsUnlockDrawerOpen(true);
                    }
                  }}
                  data-testid={`episode-sheet-ep-${item.episode}`}
                >
                  <span className="block text-base font-black">EP {item.episode}</span>
                  <span className="mt-1 block truncate text-[0.68rem] text-white/60">{item.title ?? 'Fixture episode'}</span>
                  <span className="mt-2 block text-[0.68rem] font-bold uppercase tracking-[0.12em]">{item.helper}</span>
                </Link>
              );
            })}
          </div>

          <p className="mt-4 rounded-2xl bg-white/[0.08] p-3 text-xs leading-5 text-white/68" data-testid="episode-sheet-disclaimer">
            Locked episode taps route to that exact episode and open the mock Unlock Drawer; no real payment, login, backend, or entitlement is connected.
          </p>
        </div>
      ) : null}

      {lockState === 'locked' && isUnlockDrawerOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] rounded-t-[2rem] border border-white/10 bg-[#151522]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur"
          data-testid="unlock-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlock-drawer-title"
        >
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-scene-accent">Unlock Drawer</p>
          <h2 id="unlock-drawer-title" className="mt-2 text-2xl font-black">
            EP {query.episode} is locked
          </h2>
          <p className="mt-2 text-sm font-semibold text-white/82" data-testid="unlock-drawer-context">
            {show.title} · EP {query.episode} · {episode?.title ?? 'Fixture episode placeholder'}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/70" data-testid="unlock-drawer-hook">
            {episode?.storyHook ?? 'Unlock once and continue watching this episode.'}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/[0.08] p-3" data-testid="unlock-drawer-balance">
              <p className="text-scene-muted">{formatMockDrawerBalanceLabel()}</p>
              <p className="mt-1 text-xl font-black">{show.mockBalance} coins</p>
            </div>
            <div className="rounded-2xl bg-white/[0.08] p-3" data-testid="unlock-drawer-cost">
              <p className="text-scene-muted">{formatMockDrawerCostLabel()}</p>
              <p className="mt-1 text-xl font-black">{show.mockCostPerEpisode} coins</p>
            </div>
          </div>

          <p className="mt-3 rounded-2xl bg-white/[0.08] p-3 text-xs text-white/70" data-testid="unlock-drawer-return-copy">
            Mock unlock returns to this exact watch episode with unlocked=1 and preserves safe attribution: {formatAttribution(query.attribution)}.
          </p>

          <div className="mt-4 space-y-2">
            <Link
              className="block rounded-full bg-scene-accent px-5 py-3 text-center text-sm font-black text-scene-bg"
              href={unlockHref}
              data-testid="mock-unlock-episode-link"
            >
              {hasEnoughCoins ? `Unlock EP ${query.episode}` : 'Get coins to unlock'}
            </Link>
            <Link
              className="block rounded-full border border-white/15 px-5 py-3 text-center text-sm font-bold text-white/86"
              href={passHref}
              data-testid="story-pass-secondary-link"
            >
              Get Story Pass (mock)
            </Link>
            <button
              className="w-full rounded-full px-5 py-3 text-sm font-bold text-scene-muted"
              type="button"
              onClick={() => setIsUnlockDrawerOpen(false)}
              data-testid="unlock-drawer-maybe-later"
            >
              Maybe later
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
