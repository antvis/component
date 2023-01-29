import { getItemsBBox } from '../../../../src/util/layout/utils';
import { BBox } from '../../../../src/util';

describe('utils', () => {
  it('getItemsBBox', () => {
    const items = [
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 100, y: 100, width: 50, height: 70 },
    ];
    const bbox = getItemsBBox(items.map((item) => new BBox(...Object.values(item))));
    expect(bbox.x).toBe(0);
    expect(bbox.y).toBe(0);
    expect(bbox.width).toBe(150);
    expect(bbox.height).toBe(170);

    const items2 = [
      { x: 0, y: 0, width: 100, height: 100 },
      { x: -10, y: -10, width: 100, height: 100 },
    ];
    const bbox2 = getItemsBBox(items2.map((item) => new BBox(...Object.values(item))));
    expect(bbox2.x).toBe(-10);
    expect(bbox2.y).toBe(-10);
    expect(bbox2.width).toBe(110);
    expect(bbox2.height).toBe(110);
  });
});
