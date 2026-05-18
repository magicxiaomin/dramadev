import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTION_KEYS_PHASE4D,
  ATTRIBUTION_VALUE_MAX_LENGTH,
  AUTH_RESULT_VALUES,
  CALLBACK_KEYS_PHASE4D,
  DRAWER_INTENT_VALUES,
  DRAWER_VALUES,
  FAKE_USER_REGEX,
  PURCHASE_STATUS_VALUES,
  parseAttributionValue,
  parseAuthResult,
  parseCallbackKey,
  parseDrawerIntent,
  parseDrawerVariant,
  parseEpisodeValue,
  parseFakeUser,
  parsePurchaseStatus,
  parseUnlockedFlag,
  isAllowedAttributionKey,
} from './callback-keys';

describe('callback key constants', () => {
  it('ATTRIBUTION_KEYS_PHASE4D contains exactly the 9-key PHASE4D baseline', () => {
    expect(ATTRIBUTION_KEYS_PHASE4D).toEqual([
      'source',
      'campaign_id',
      'adset_id',
      'ad_id',
      'creative_id',
      'placement',
      'utm_source',
      'utm_campaign',
      'utm_content',
    ]);
  });

  it('CALLBACK_KEYS_PHASE4D lists only parseable staging callback keys and excludes idempotency_key', () => {
    expect(CALLBACK_KEYS_PHASE4D).toEqual([
      ...ATTRIBUTION_KEYS_PHASE4D,
      'episode',
      'unlocked',
      'purchase_status',
      'auth_result',
      'drawer',
      'drawer_intent',
      'fake_user',
    ]);
    expect(CALLBACK_KEYS_PHASE4D).not.toContain('idempotency_key');
  });
});

describe('parseAttributionValue', () => {
  it('parseAttributionValue accepts non-empty strings up to 128 chars and first array value', () => {
    expect(parseAttributionValue('facebook')).toBe('facebook');
    expect(parseAttributionValue('x'.repeat(ATTRIBUTION_VALUE_MAX_LENGTH))).toBe('x'.repeat(ATTRIBUTION_VALUE_MAX_LENGTH));
    expect(parseAttributionValue(['first', 'second'])).toBe('first');
  });

  it('parseAttributionValue drops empty, whitespace-only, overlong, array-non-string, and non-string input', () => {
    expect(parseAttributionValue('')).toBeUndefined();
    expect(parseAttributionValue('   ')).toBeUndefined();
    expect(parseAttributionValue('x'.repeat(ATTRIBUTION_VALUE_MAX_LENGTH + 1))).toBeUndefined();
    expect(parseAttributionValue([123, 'second'])).toBeUndefined();
    expect(parseAttributionValue(123)).toBeUndefined();
    expect(parseAttributionValue({ value: 'facebook' })).toBeUndefined();
  });
});

describe('parseEpisodeValue', () => {
  it('parseEpisodeValue parses positive ints 1..9999 and first array value', () => {
    expect(parseEpisodeValue('1')).toBe(1);
    expect(parseEpisodeValue('9999')).toBe(9999);
    expect(parseEpisodeValue(['12', '13'])).toBe(12);
  });

  it('parseEpisodeValue drops unknown, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parseEpisodeValue('0')).toBeUndefined();
    expect(parseEpisodeValue('-1')).toBeUndefined();
    expect(parseEpisodeValue('1.5')).toBeUndefined();
    expect(parseEpisodeValue('0001')).toBeUndefined();
    expect(parseEpisodeValue('')).toBeUndefined();
    expect(parseEpisodeValue('   ')).toBeUndefined();
    expect(parseEpisodeValue('10000')).toBeUndefined();
    expect(parseEpisodeValue([2, '3'])).toBeUndefined();
    expect(parseEpisodeValue(2)).toBeUndefined();
    expect(parseEpisodeValue({ value: '2' })).toBeUndefined();
  });
});

describe('parseUnlockedFlag', () => {
  it('parseUnlockedFlag is true only for literal "1" and first array value', () => {
    expect(parseUnlockedFlag('1')).toBe(true);
    expect(parseUnlockedFlag(['1', '0'])).toBe(true);
  });

  it('parseUnlockedFlag returns false for unknown, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parseUnlockedFlag('true')).toBe(false);
    expect(parseUnlockedFlag('')).toBe(false);
    expect(parseUnlockedFlag('   ')).toBe(false);
    expect(parseUnlockedFlag('11')).toBe(false);
    expect(parseUnlockedFlag([1, '1'])).toBe(false);
    expect(parseUnlockedFlag(1)).toBe(false);
    expect(parseUnlockedFlag({ value: '1' })).toBe(false);
  });
});

describe('parsePurchaseStatus', () => {
  it('parsePurchaseStatus accepts every PURCHASE_STATUS_VALUES member and first array value', () => {
    for (const value of PURCHASE_STATUS_VALUES) {
      expect(parsePurchaseStatus(value)).toBe(value);
    }
    expect(parsePurchaseStatus(['succeeded', 'failed'])).toBe('succeeded');
  });

  it('parsePurchaseStatus drops unknown, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parsePurchaseStatus('unknown')).toBeUndefined();
    expect(parsePurchaseStatus('')).toBeUndefined();
    expect(parsePurchaseStatus('   ')).toBeUndefined();
    expect(parsePurchaseStatus('x'.repeat(17))).toBeUndefined();
    expect(parsePurchaseStatus([123, 'succeeded'])).toBeUndefined();
    expect(parsePurchaseStatus(123)).toBeUndefined();
    expect(parsePurchaseStatus({ value: 'succeeded' })).toBeUndefined();
  });
});

describe('parseAuthResult', () => {
  it('parseAuthResult accepts every AUTH_RESULT_VALUES member and first array value', () => {
    for (const value of AUTH_RESULT_VALUES) {
      expect(parseAuthResult(value)).toBe(value);
    }
    expect(parseAuthResult(['success', 'failed'])).toBe('success');
  });

  it('parseAuthResult drops unknown, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parseAuthResult('unknown')).toBeUndefined();
    expect(parseAuthResult('')).toBeUndefined();
    expect(parseAuthResult('   ')).toBeUndefined();
    expect(parseAuthResult('x'.repeat(17))).toBeUndefined();
    expect(parseAuthResult([123, 'success'])).toBeUndefined();
    expect(parseAuthResult(123)).toBeUndefined();
    expect(parseAuthResult({ value: 'success' })).toBeUndefined();
  });
});

describe('parseDrawerVariant', () => {
  it('parseDrawerVariant accepts unlock|pass and first array value', () => {
    for (const value of DRAWER_VALUES) {
      expect(parseDrawerVariant(value)).toBe(value);
    }
    expect(parseDrawerVariant(['unlock', 'pass'])).toBe('unlock');
  });

  it('parseDrawerVariant drops unknown, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parseDrawerVariant('other')).toBeUndefined();
    expect(parseDrawerVariant('')).toBeUndefined();
    expect(parseDrawerVariant('   ')).toBeUndefined();
    expect(parseDrawerVariant('x'.repeat(17))).toBeUndefined();
    expect(parseDrawerVariant([123, 'unlock'])).toBeUndefined();
    expect(parseDrawerVariant(123)).toBeUndefined();
    expect(parseDrawerVariant({ value: 'unlock' })).toBeUndefined();
  });
});

describe('parseDrawerIntent', () => {
  it('parseDrawerIntent accepts single_episode|story_pass and first array value', () => {
    for (const value of DRAWER_INTENT_VALUES) {
      expect(parseDrawerIntent(value)).toBe(value);
    }
    expect(parseDrawerIntent(['single_episode', 'story_pass'])).toBe('single_episode');
  });

  it('parseDrawerIntent drops unknown, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parseDrawerIntent('other')).toBeUndefined();
    expect(parseDrawerIntent('')).toBeUndefined();
    expect(parseDrawerIntent('   ')).toBeUndefined();
    expect(parseDrawerIntent('x'.repeat(33))).toBeUndefined();
    expect(parseDrawerIntent([123, 'single_episode'])).toBeUndefined();
    expect(parseDrawerIntent(123)).toBeUndefined();
    expect(parseDrawerIntent({ value: 'single_episode' })).toBeUndefined();
  });
});

describe('parseFakeUser', () => {
  it('parseFakeUser accepts fake_user_<id> values and first array value', () => {
    expect(FAKE_USER_REGEX.test('fake_user_abc-123_X')).toBe(true);
    expect(parseFakeUser('fake_user_abc-123_X')).toBe('fake_user_abc-123_X');
    expect(parseFakeUser(['fake_user_first', 'fake_user_second'])).toBe('fake_user_first');
  });

  it('parseFakeUser drops regex-fail, sentinels, PII-suspect, empty, whitespace, overlong, array-non-string, and non-string input', () => {
    expect(parseFakeUser('user_abc')).toBeUndefined();
    expect(parseFakeUser('anon')).toBeUndefined();
    expect(parseFakeUser('guest')).toBeUndefined();
    expect(parseFakeUser('none')).toBeUndefined();
    expect(parseFakeUser('unknown')).toBeUndefined();
    expect(parseFakeUser('fake_user_anon')).toBeUndefined();
    expect(parseFakeUser('fake_user_guest')).toBeUndefined();
    expect(parseFakeUser('fake_user_none')).toBeUndefined();
    expect(parseFakeUser('fake_user_unknown')).toBeUndefined();
    expect(parseFakeUser('person@example.com')).toBeUndefined();
    expect(parseFakeUser('123456')).toBeUndefined();
    expect(parseFakeUser('fake_user_123456')).toBeUndefined();
    expect(parseFakeUser('')).toBeUndefined();
    expect(parseFakeUser('   ')).toBeUndefined();
    expect(parseFakeUser(`fake_user_${'x'.repeat(55)}`)).toBeUndefined();
    expect(parseFakeUser([123, 'fake_user_next'])).toBeUndefined();
    expect(parseFakeUser(123)).toBeUndefined();
    expect(parseFakeUser({ value: 'fake_user_abc' })).toBeUndefined();
  });
});

describe('isAllowedAttributionKey', () => {
  it('isAllowedAttributionKey accepts only the 9 attribution keys', () => {
    for (const key of ATTRIBUTION_KEYS_PHASE4D) {
      expect(isAllowedAttributionKey(key)).toBe(true);
    }
    expect(isAllowedAttributionKey('utm_medium')).toBe(false);
    expect(isAllowedAttributionKey('')).toBe(false);
    expect(isAllowedAttributionKey('   ')).toBe(false);
    expect(isAllowedAttributionKey('source'.repeat(40))).toBe(false);
    expect(isAllowedAttributionKey(['source', 'ad_id'])).toBe(false);
    expect(isAllowedAttributionKey(123)).toBe(false);
  });
});

describe('parseCallbackKey', () => {
  it('parseCallbackKey dispatches known keys through their validators and drops unknown/idempotency_key', () => {
    expect(parseCallbackKey('source', 'facebook')).toBe('facebook');
    expect(parseCallbackKey('episode', '7')).toBe(7);
    expect(parseCallbackKey('unlocked', '1')).toBe(true);
    expect(parseCallbackKey('purchase_status', 'succeeded')).toBe('succeeded');
    expect(parseCallbackKey('auth_result', 'success')).toBe('success');
    expect(parseCallbackKey('drawer', 'unlock')).toBe('unlock');
    expect(parseCallbackKey('drawer_intent', 'story_pass')).toBe('story_pass');
    expect(parseCallbackKey('fake_user', 'fake_user_abc')).toBe('fake_user_abc');
    expect(parseCallbackKey('utm_medium', 'cpc')).toBeUndefined();
    expect(parseCallbackKey('idempotency_key', 'idem_123')).toBeUndefined();
  });
});
