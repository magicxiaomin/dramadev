export type QueryParamValue = string | string[] | undefined;
export type QueryParams = Record<string, QueryParamValue>;

export type AttributionParams = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

export type ParsedWatchQueryParams = {
  episode: number;
  unlocked: boolean;
  attribution: AttributionParams;
};

export type ParsedPassQueryParams = {
  story?: string;
  episode: number;
  attribution: AttributionParams;
};

export const ATTRIBUTION_KEYS = [
  'source',
  'campaign_id',
  'adset_id',
  'ad_id',
  'creative_id',
  'placement',
  'utm_source',
  'utm_campaign',
  'utm_content',
] as const;

function firstValue(value: QueryParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function clampEpisode(value: QueryParamValue, totalEpisodes: number): number {
  const rawEpisode = firstValue(value);
  const parsedEpisode = rawEpisode ? Number.parseInt(rawEpisode, 10) : 1;
  const safeTotal = Number.isFinite(totalEpisodes) && totalEpisodes > 0 ? Math.floor(totalEpisodes) : 1;

  if (!Number.isFinite(parsedEpisode) || parsedEpisode < 1) {
    return 1;
  }

  return Math.min(parsedEpisode, safeTotal);
}

export function parseWatchQueryParams(params: QueryParams, totalEpisodes: number): ParsedWatchQueryParams {
  const attribution: AttributionParams = {};

  for (const key of ATTRIBUTION_KEYS) {
    const value = firstValue(params[key]);
    if (value) {
      attribution[key] = value;
    }
  }

  return {
    episode: clampEpisode(params.episode, totalEpisodes),
    unlocked: firstValue(params.unlocked) === '1',
    attribution,
  };
}

export type BuildWatchEpisodeHrefInput = {
  showId: string;
  episode: number;
  attribution?: AttributionParams;
  unlocked?: boolean;
};

export function buildWatchEpisodeHref({ showId, episode, attribution = {}, unlocked = false }: BuildWatchEpisodeHrefInput): string {
  const params = new URLSearchParams({ episode: String(episode) });

  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) {
      params.set(key, value);
    }
  }

  if (unlocked) {
    params.set('unlocked', '1');
  }

  return `/variant-b/watch/${showId}?${params.toString()}`;
}

export type BuildPassHrefInput = {
  showId: string;
  episode: number;
  attribution?: AttributionParams;
};

function appendAttributionParams(params: URLSearchParams, attribution: AttributionParams): void {
  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) {
      params.set(key, value);
    }
  }
}

export function buildPassHref({ showId, episode, attribution = {} }: BuildPassHrefInput): string {
  const params = new URLSearchParams({ story: showId, episode: String(episode) });
  appendAttributionParams(params, attribution);

  return `/variant-b/pass?${params.toString()}`;
}

export type BuildPassReturnHrefInput = BuildPassHrefInput;

export function buildPassReturnHref(input: BuildPassReturnHrefInput): string {
  return buildWatchEpisodeHref({ ...input, unlocked: true });
}

export type BuildShowDetailHrefInput = BuildPassHrefInput;

export function buildShowDetailHref({ showId, episode, attribution = {} }: BuildShowDetailHrefInput): string {
  const params = new URLSearchParams({ episode: String(episode) });
  appendAttributionParams(params, attribution);

  return `/variant-b/show/${showId}?${params.toString()}`;
}

export function parsePassQueryParams(params: QueryParams, totalEpisodes: number): ParsedPassQueryParams {
  const attribution: AttributionParams = {};

  for (const key of ATTRIBUTION_KEYS) {
    const value = firstValue(params[key]);
    if (value) {
      attribution[key] = value;
    }
  }

  return {
    story: firstValue(params.story),
    episode: clampEpisode(params.episode, totalEpisodes),
    attribution,
  };
}
