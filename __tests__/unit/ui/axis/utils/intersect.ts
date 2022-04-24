import { intersect } from '../../../../../src/ui/axis/utils/intersect';

describe('Intersect', () => {
  it('intersect(box1, box2) without rotation', () => {
    const a = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersect(a, b)).toBe(false);

    const a1 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersect(a1, b1)).toBe(true);

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 50, x2: 60, y2: 80, rotation: 0 };
    expect(intersect(a2, b2)).toBe(false);
  });

  it('intersect(box1, box2) with rotation', () => {
    const a = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30, y1: 0, x2: 60, y2: 50, rotation: 40 };
    expect(intersect(a, b)).toBe(true);

    const a1 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: -90 };
    expect(intersect(a1, b1)).toBe(false);

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: -20 };
    expect(intersect(a2, b2)).toBe(true);

    const a3 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b3 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: 20 };
    expect(intersect(a3, b3)).toBe(false);
  });
});
