export const ATTRIBUTION_KEYS_PHASE4D = [
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

export type AttributionKey = (typeof ATTRIBUTION_KEYS_PHASE4D)[number];

export const ATTRIBUTION_VALUE_MAX_LENGTH = 128;
export const CALLBACK_VALUE_MAX_LENGTH = 256;

export const PURCHASE_STATUS_VALUES = ['succeeded', 'cancelled', 'failed', 'pending', 'revoked'] as const;
export const AUTH_RESULT_VALUES = ['success', 'cancelled', 'failed'] as const;
export const DRAWER_VALUES = ['unlock', 'pass'] as const;
export const DRAWER_INTENT_VALUES = ['single_episode', 'story_pass'] as const;

export type PurchaseStatus = (typeof PURCHASE_STATUS_VALUES)[number];
export type AuthResult = (typeof AUTH_RESULT_VALUES)[number];
export type DrawerVariant = (typeof DRAWER_VALUES)[number];
export type DrawerIntent = (typeof DRAWER_INTENT_VALUES)[number];

export const CALLBACK_KEYS_PHASE4D = [
  ...ATTRIBUTION_KEYS_PHASE4D,
  'episode',
  'unlocked',
  'purchase_status',
  'auth_result',
  'drawer',
  'drawer_intent',
  'fake_user',
] as const;

export type CallbackKey = (typeof CALLBACK_KEYS_PHASE4D)[number];

export const FAKE_USER_REGEX = /^fake_user_[A-Za-z0-9_-]{1,32}$/;
export const EPISODE_VALUE_REGEX = /^[1-9][0-9]{0,3}$/;

function firstString(raw: unknown): string | undefined {
  if (Array.isArray(raw)) {
    return typeof raw[0] === 'string' ? raw[0] : undefined;
  }

  return typeof raw === 'string' ? raw : undefined;
}

function parseBoundedNonBlankString(raw: unknown, maxLength: number): string | undefined {
  const value = firstString(raw);
  if (value === undefined || value.trim() === '' || value.length > maxLength) {
    return undefined;
  }

  return value;
}

function parseEnumValue<T extends readonly string[]>(raw: unknown, allowedValues: T, maxLength: number): T[number] | undefined {
  const value = parseBoundedNonBlankString(raw, maxLength);
  if (value === undefined) {
    return undefined;
  }

  return allowedValues.includes(value) ? value : undefined;
}

export function isAllowedAttributionKey(key: unknown): key is AttributionKey {
  return typeof key === 'string' && (ATTRIBUTION_KEYS_PHASE4D as readonly string[]).includes(key);
}

export function parseAttributionValue(raw: unknown): string | undefined {
  return parseBoundedNonBlankString(raw, ATTRIBUTION_VALUE_MAX_LENGTH);
}

export function parseEpisodeValue(raw: unknown): number | undefined {
  const value = parseBoundedNonBlankString(raw, 4);
  if (value === undefined || !EPISODE_VALUE_REGEX.test(value)) {
    return undefined;
  }

  return Number.parseInt(value, 10);
}

export function parseUnlockedFlag(raw: unknown): boolean {
  return firstString(raw) === '1';
}

export function parsePurchaseStatus(raw: unknown): PurchaseStatus | undefined {
  return parseEnumValue(raw, PURCHASE_STATUS_VALUES, 16);
}

export function parseAuthResult(raw: unknown): AuthResult | undefined {
  return parseEnumValue(raw, AUTH_RESULT_VALUES, 16);
}

export function parseDrawerVariant(raw: unknown): DrawerVariant | undefined {
  return parseEnumValue(raw, DRAWER_VALUES, 16);
}

export function parseDrawerIntent(raw: unknown): DrawerIntent | undefined {
  return parseEnumValue(raw, DRAWER_INTENT_VALUES, 32);
}

const FAKE_USER_PREFIX = 'fake_user_';
const FAKE_USER_SENTINELS = new Set(['anon', 'guest', 'none', 'unknown']);

export function parseFakeUser(raw: unknown): string | undefined {
  const value = parseBoundedNonBlankString(raw, 64);
  if (value === undefined || !FAKE_USER_REGEX.test(value)) {
    return undefined;
  }

  const fakeUserId = value.slice(FAKE_USER_PREFIX.length);
  if (FAKE_USER_SENTINELS.has(fakeUserId) || /^\d+$/.test(fakeUserId)) {
    return undefined;
  }

  return value;
}

export function parseCallbackKey(key: unknown, raw: unknown): string | number | boolean | undefined {
  if (isAllowedAttributionKey(key)) {
    return parseAttributionValue(raw);
  }

  switch (key) {
    case 'episode':
      return parseEpisodeValue(raw);
    case 'unlocked':
      return parseUnlockedFlag(raw);
    case 'purchase_status':
      return parsePurchaseStatus(raw);
    case 'auth_result':
      return parseAuthResult(raw);
    case 'drawer':
      return parseDrawerVariant(raw);
    case 'drawer_intent':
      return parseDrawerIntent(raw);
    case 'fake_user':
      return parseFakeUser(raw);
    default:
      return undefined;
  }
}
