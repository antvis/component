import { numberInterpolate, objectInterpolate, arrayInterpolate, interpolate } from '../../../src/util/interpolate';

describe('Interpolate', () => {
  it('number interpolate', () => {
    const it = numberInterpolate(0, 10);
    expect(it(0)).toBe(0);
    expect(it(0.5)).toBe(5);
    expect(it(1)).toBe(10);
  });

  it('object interpolate', () => {
    const it = objectInterpolate({ x: 0, y: 10 }, { x: 10, y: 0 });
    expect(it(0)).toEqual({ x: 0, y: 10 });
    expect(it(0.5)).toEqual({ x: 5, y: 5 });
    expect(it(1)).toEqual({ x: 10, y: 0 });
  });

  it('array interpolate', () => {
    const ait = arrayInterpolate([0, 10], [10, 0]);
    expect(ait(0)).toEqual([0, 10]);
    expect(ait(0.5)).toEqual([5, 5]);
    expect(ait(1)).toEqual([10, 0]);
  });

  it('interpolate', () => {
    const nit = interpolate(0, 10);
    expect(nit(0)).toBe(0);
    expect(nit(0.5)).toBe(5);
    expect(nit(1)).toBe(10);

    const ait = interpolate([0, 10], [10, 0]);
    expect(ait(0)).toEqual([0, 10]);
    expect(ait(0.5)).toEqual([5, 5]);
    expect(ait(1)).toEqual([10, 0]);

    const oit = interpolate({ x: 0, y: 10 }, { x: 10, y: 0 });
    expect(oit(0)).toEqual({ x: 0, y: 10 });
    expect(oit(0.5)).toEqual({ x: 5, y: 5 });
    expect(oit(1)).toEqual({ x: 10, y: 0 });

    expect(oit(0)).not.toEqual({ x: 10, y: 5 });
  });
});
