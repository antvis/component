import { getAreaLineY } from '../../../src/trend/path';

describe('trend path', () => {
  it('getAreaLineY', () => {
    expect(getAreaLineY([1, 2, 3, 4, 5], 50)).toBe(50);

    expect(getAreaLineY([-1, -2, -3, 4, 5, ], 50)).toBe(31.25);
  });
});