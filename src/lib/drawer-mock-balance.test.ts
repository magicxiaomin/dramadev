import { describe, expect, it } from 'vitest';

import { formatMockDrawerBalanceLabel, formatMockDrawerCostLabel } from './drawer-mock-balance';

describe('drawer mock balance copy', () => {
  it('frames drawer balance and cost as drawer-only mock values', () => {
    expect(formatMockDrawerBalanceLabel()).toBe('Drawer mock balance');
    expect(formatMockDrawerCostLabel()).toBe('Drawer mock cost');
  });
});
