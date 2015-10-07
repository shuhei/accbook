import { strictEqual } from 'assert';

import { formatDate, formatNumber } from '../src/formatters';

describe('formatDate', () => {
  it('formats date', () => {
    strictEqual(formatDate(new Date(2015, 3 - 1, 4)), '3/4');
    strictEqual(formatDate(new Date(2015, 12 - 1, 31)), '12/31');
  });

  it('returns empty string for empty value', () => {
    strictEqual(formatDate(null), '');
    strictEqual(formatDate(undefined), '');
  });
});

describe('formatNumber', () => {
  it('inserts commas', () => {
    strictEqual(formatNumber(1234567), '1,234,567');
    strictEqual(formatNumber(12345678), '12,345,678');
    strictEqual(formatNumber(123456789), '123,456,789');
  });

  it('works with zero', () => {
    strictEqual(formatNumber(0), '0');
  });

  it('works with minus number', () => {
    strictEqual(formatNumber(-1234567), '-1,234,567');
    strictEqual(formatNumber(-12345678), '-12,345,678');
    strictEqual(formatNumber(-123456789), '-123,456,789');
  });
});
