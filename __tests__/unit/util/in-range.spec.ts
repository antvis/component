import { inRange } from '../../../src/util';

describe('in range', () => {
  it('open set', () => {
    expect(inRange(1, 0, 2, false, false)).toBe(true);
    expect(inRange(0, 0, 2, false, false)).toBe(false);
    expect(inRange(2, 0, 2, false, false)).toBe(false);
  });

  it('left closed set', () => {
    expect(inRange(1, 0, 2)).toBe(true);
    expect(inRange(0, 0, 2)).toBe(true);
    expect(inRange(2, 0, 2)).toBe(false);
    expect(inRange(1, 0, 2, true, false)).toBe(true);
    expect(inRange(0, 0, 2, true, false)).toBe(true);
    expect(inRange(2, 0, 2, true, false)).toBe(false);
  });

  it('right closed set', () => {
    expect(inRange(1, 0, 2, false, true)).toBe(true);
    expect(inRange(0, 0, 2, false, true)).toBe(false);
    expect(inRange(2, 0, 2, false, true)).toBe(true);
  });

  it('closed set', () => {
    expect(inRange(1, 0, 2, true, true)).toBe(true);
    expect(inRange(0, 0, 2, true, true)).toBe(true);
    expect(inRange(2, 0, 2, true, true)).toBe(true);
  });
});
