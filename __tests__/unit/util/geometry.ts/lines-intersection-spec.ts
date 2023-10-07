import { intersection } from '../../../../src';

describe('Intersection', () => {
  test('intersection', () => {
    expect(intersection([0, 2], [2, 0], [0, 0], [2, 2])).toStrictEqual([1, 1]);
    expect(intersection([-2, -2], [2, 2], [-2, 2], [2, -2])).toStrictEqual([0, 0]);
    expect(intersection([-2, 2], [3, 2], [2, -3], [2, 10])).toStrictEqual([2, 2]);
  });
});
