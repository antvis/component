import { Bounds } from '../../../src/layout/bounds';

describe('Bounds', () => {
  it('new Bounds(), getter left right top bottom width and height', () => {
    const bounds = new Bounds({ left: 20, top: 20, right: 100, bottom: 220 });

    expect(bounds.left).toBe(20);
    expect(bounds.right).toBe(100);
    expect(bounds.top).toBe(20);
    expect(bounds.width).toBe(80);
    expect(bounds.height).toBe(200);
  });

  it('width & height should be undefined before bounds declare right and bottom', () => {
    const bounds = new Bounds({ left: 20, top: 20 });
    expect(bounds.defined('right')).toBe(false);
    expect(bounds.width).toBeUndefined();
    expect(bounds.defined('bottom')).toBe(false);
    expect(bounds.height).toBeUndefined();

    bounds.set(20, 40, 50, 80);
    expect(bounds.width).toBe(30);
    expect(bounds.height).toBe(40);
  });

  it('Bounds.set(x1, y1, x2, y2)', () => {
    const bounds = new Bounds();
    bounds.set(50, 80, 20, 40);
    expect(bounds.left).toBe(20);
    expect(bounds.right).toBe(50);
    expect(bounds.top).toBe(40);
    expect(bounds.bottom).toBe(80);
  });

  it('Bounds intersects', () => {
    const bounds = new Bounds({ left: 20, top: 20, right: 40, bottom: 40 });
    expect(bounds.intersects(new Bounds({ left: 10, top: 20, right: 40, bottom: 40 }))).toBe(true);
    expect(bounds.intersects(new Bounds({ left: 50, top: 20, right: 40, bottom: 40 }))).toBe(false);
  });

  it('Bounds add, empty and clear', () => {
    const bounds = new Bounds();
    expect(bounds.empty()).toBe(true);
    bounds.add(30, 50);
    expect(bounds.left).toBe(30);
    expect(bounds.right).toBe(30);
    expect(bounds.top).toBe(50);
    expect(bounds.bottom).toBe(50);
    expect(bounds.width).toBe(0);
    expect(bounds.height).toBe(0);
    bounds.add(20, 30);
    expect(bounds.top).toBe(30);
    expect(bounds.left).toBe(20);
    expect(bounds.width).toBe(10);
    expect(bounds.height).toBe(20);

    bounds.clear();
    expect(bounds.defined('left')).toBe(false);
    expect(bounds.defined('top')).toBe(false);
    expect(bounds.defined('right')).toBe(false);
    expect(bounds.defined('bottom')).toBe(false);
  });

  it('Bounds rotate at specified point', () => {
    const bounds = new Bounds({ left: 20, right: 40, top: 20, bottom: 40 });
    bounds.rotate((45 / 180) * Math.PI, 30, 30);
    const r = 10 / Math.cos((45 / 180) * Math.PI);
    expect(bounds.top).toBeCloseTo(30 - r);
    expect(bounds.left).toBeCloseTo(30 - r);
    expect(bounds.right).toBeCloseTo(30 + r);
    expect(bounds.bottom).toBeCloseTo(30 + r);
  });
});
