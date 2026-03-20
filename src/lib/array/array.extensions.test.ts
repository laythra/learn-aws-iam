import { describe, expect, it } from 'vitest';

import '@/lib/array/array.extensions';

describe('Array.prototype.filterMap', () => {
  it('maps and filters out nulls', () => {
    const result = [1, 2, 3, 4, 5].filterMap(x => (x % 2 === 0 ? x * 10 : null));
    expect(result).toEqual([20, 40]);
  });

  it('maps and filters out undefineds', () => {
    const result = ['a', '', 'b', ''].filterMap(x => (x.length > 0 ? x.toUpperCase() : undefined));
    expect(result).toEqual(['A', 'B']);
  });

  it('returns empty array when all items are filtered', () => {
    const result = [1, 2, 3].filterMap(() => null);
    expect(result).toEqual([]);
  });

  it('returns all items when nothing is filtered', () => {
    const result = [1, 2, 3].filterMap(x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('provides correct index and array to callback', () => {
    const indices: number[] = [];
    [10, 20, 30].filterMap((_, i) => {
      indices.push(i);
      return true;
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  it('handles empty array', () => {
    const result = ([] as number[]).filterMap(x => x);
    expect(result).toEqual([]);
  });
});
