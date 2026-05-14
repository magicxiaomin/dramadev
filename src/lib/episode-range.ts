import type { EpisodeRange } from '@/types/scene-flow';

export function buildEpisodeRanges(totalEpisodes: number, requestedRangeSize: number): EpisodeRange[] {
  const total = Math.floor(totalEpisodes);

  if (!Number.isFinite(total) || total < 1) {
    return [];
  }

  const rangeSize = Number.isFinite(requestedRangeSize) && requestedRangeSize > 0 ? Math.floor(requestedRangeSize) : total;
  const ranges: EpisodeRange[] = [];

  for (let start = 1; start <= total; start += rangeSize) {
    const end = Math.min(start + rangeSize - 1, total);
    ranges.push({ label: `${start}-${end}`, start, end });
  }

  return ranges;
}

export function findEpisodeRange(ranges: EpisodeRange[], episode: number): EpisodeRange | undefined {
  return ranges.find((range) => episode >= range.start && episode <= range.end);
}
