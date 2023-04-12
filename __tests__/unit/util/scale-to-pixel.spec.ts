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
    expect(scaleToPixel(rect1, 50)).toBeCloseTo(0.5, 3);

    const rect2 = new Rect({
      style: {
        width: 50,
        height: 40,
      },
    });
    expect(scaleToPixel(rect2, 50)).toBeCloseTo(1, 3);

    // width: 20
    // height: 10
    const path1 = new Path({
      style: {
        path: 'M0,0 L10,10 L20,0 Z',
      },
    });
    const path1Bbox = path1.getBBox();
    expect(path1Bbox.width).toBeCloseTo(20, 3);
    expect(path1Bbox.height).toBeCloseTo(10, 3);

    expect(scaleToPixel(path1, 50)).toBeCloseTo(2.5, 3);
  });

  it('with apply', () => {
    const rect1 = new Rect({
      style: {
        width: 100,
        height: 100,
      },
    });
    scaleToPixel(rect1, 50, true);
    expect(rect1.getBBox().width).toBeCloseTo(50, 3);

    const rect2 = new Rect({
      style: {
        width: 50,
        height: 40,
      },
    });
    scaleToPixel(rect2, 50, true);
    expect(rect2.getBBox().width).toBeCloseTo(50, 3);

    // width: 20
    // height: 10
    const path1 = new Path({
      style: {
        path: 'M0,0 L10,10 L20,0 Z',
      },
    });
    const path1Bbox = path1.getBBox();
    expect(path1Bbox.width).toBeCloseTo(20, 3);
    expect(path1Bbox.height).toBeCloseTo(10, 3);

    scaleToPixel(path1, 11, true);
    expect(path1.getBBox().width).toBeCloseTo(11, 3);
  });
});
