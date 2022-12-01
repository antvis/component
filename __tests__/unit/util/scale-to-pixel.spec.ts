import { Path, Rect } from '@antv/g';
import { scaleToPixel } from '../../../src/util';

describe('scale to pixel', () => {
  it('without apply', () => {
    const rect1 = new Rect({
      style: {
        width: 100,
        height: 100,
      },
    });
    expect(scaleToPixel(rect1, 50)).toBe(0.5);

    const rect2 = new Rect({
      style: {
        width: 50,
        height: 40,
      },
    });
    expect(scaleToPixel(rect2, 50)).toBe(1);

    // width: 20
    // height: 10
    const path1 = new Path({
      style: {
        path: 'M0,0 L10,10 L20,0 Z',
      },
    });
    const path1Bbox = path1.getBBox();
    expect(path1Bbox.width).toBe(20);
    expect(path1Bbox.height).toBe(10);

    expect(scaleToPixel(path1, 50)).toBe(2.5);
  });

  it('with apply', () => {
    const rect1 = new Rect({
      style: {
        width: 100,
        height: 100,
      },
    });
    scaleToPixel(rect1, 50, true);
    expect(rect1.getBBox().width).toBe(50);

    const rect2 = new Rect({
      style: {
        width: 50,
        height: 40,
      },
    });
    scaleToPixel(rect2, 50, true);
    expect(rect2.getBBox().width).toBe(50);

    // width: 20
    // height: 10
    const path1 = new Path({
      style: {
        path: 'M0,0 L10,10 L20,0 Z',
      },
    });
    const path1Bbox = path1.getBBox();
    expect(path1Bbox.width).toBe(20);
    expect(path1Bbox.height).toBe(10);

    scaleToPixel(path1, 11, true);
    expect(path1.getBBox().width).toBe(11);
  });
});
