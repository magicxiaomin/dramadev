import {
  ATTRIBUTION_KEYS_PHASE4D,
  parseAttributionValue,
  parseAuthResult,
  parseDrawerIntent,
  parseDrawerVariant,
  parseFakeUser,
  parseEpisodeValue,
  parseUnlockedFlag,
  type AttributionKey,
  type AuthResult,
  type DrawerIntent,
  type DrawerVariant,
  type PurchaseStatus,
  parsePurchaseStatus,
} from './callback-keys';

export type QueryParamValue = string | string[] | undefined;
export type QueryParams = Record<string, QueryParamValue>;

export type AttributionParams = Partial<Record<AttributionKey, string>>;

export type ParsedWatchQueryParams = {
  episode: number;
  unlocked: boolean;
  attribution: AttributionParams;
  purchaseStatus?: PurchaseStatus;
  authResult?: AuthResult;
  drawer?: DrawerVariant;
  drawerIntent?: DrawerIntent;
  fakeUser?: string;
};

export type ParsedPassQueryParams = {
  story?: string;
  episode: number;
  attribution: AttributionParams;
};

function firstValue(value: QueryParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function clampEpisode(value: QueryParamValue, totalEpisodes: number): number {
  const parsedEpisode = parseEpisodeValue(value) ?? 1;
  const safeTotal = Number.isFinite(totalEpisodes) && totalEpisodes > 0 ? Math.floor(totalEpisodes) : 1;

  return Math.min(parsedEpisode, safeTotal);
}

function parseAttribution(params: QueryParams): AttributionParams {
  const attribution: AttributionParams = {};

  for (const key of ATTRIBUTION_KEYS_PHASE4D) {
    const value = parseAttributionValue(params[key]);
    if (value !== undefined) {
      attribution[key] = value;
    }
  }

  return attribution;
}

function withOptionalWatchCallbacks(parsed: ParsedWatchQueryParams, params: QueryParams): ParsedWatchQueryParams {
  const purchaseStatus = parsePurchaseStatus(params.purchase_status);
  const authResult = parseAuthResult(params.auth_result);
  const drawer = parseDrawerVariant(params.drawer);
  const drawerIntent = parseDrawerIntent(params.drawer_intent);
  const fakeUser = parseFakeUser(params.fake_user);

  return {
    ...parsed,
    ...(purchaseStatus !== undefined ? { purchaseStatus } : {}),
    ...(authResult !== undefined ? { authResult } : {}),
    ...(drawer !== undefined ? { drawer } : {}),
    ...(drawerIntent !== undefined ? { drawerIntent } : {}),
    ...(fakeUser !== undefined ? { fakeUser } : {}),
  };
}

export function parseWatchQueryParams(params: QueryParams, totalEpisodes: number): ParsedWatchQueryParams {
  return withOptionalWatchCallbacks(
    {
      episode: clampEpisode(params.episode, totalEpisodes),
      unlocked: parseUnlockedFlag(params.unlocked),
      attribution: parseAttribution(params),
    },
    params,
  );
}

export type BuildWatchEpisodeHrefInput = {
  showId: string;
  episode: number;
  attribution?: AttributionParams;
  unlocked?: boolean;
};

function appendAttributionParams(params: URLSearchParams, attribution: AttributionParams): void {
  for (const key of ATTRIBUTION_KEYS_PHASE4D) {
    const value = parseAttributionValue(attribution[key]);
    if (value !== undefined) {
      params.set(key, value);
    }
  }
}

export function buildWatchEpisodeHref({ showId, episode, attribution = {}, unlocked = false }: BuildWatchEpisodeHrefInput): string {
  const params = new URLSearchParams({ episode: String(episode) });
  appendAttributionParams(params, attribution);

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
  return {
    story: firstValue(params.story),
    episode: clampEpisode(params.episode, totalEpisodes),
    attribution: parseAttribution(params),
  };
}
