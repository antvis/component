import { parseSeriesAttr } from '../../../src/util';

describe('padding', () => {
  test('number', async () => {
    expect(parseSeriesAttr(1)).toStrictEqual([1, 1, 1, 1]);
  });

  test('array1', async () => {
    expect(parseSeriesAttr([2])).toStrictEqual([2, 2, 2, 2]);
  });

  test('array2', async () => {
    expect(parseSeriesAttr([1, 2])).toStrictEqual([1, 2, 1, 2]);
  });

  test('array3', async () => {
    expect(parseSeriesAttr([1, 2, 3])).toStrictEqual([1, 2, 3, 2]);
  });

  test('array4', async () => {
    expect(parseSeriesAttr([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
  });
});
