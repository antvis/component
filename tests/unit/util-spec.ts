import { getAlignPoint, getOutSides, getPointByPosition } from '../../src/util/align';
import { createBBox, intersectBBox, mergeBBox } from '../../src/util/util';
describe('test util', () => {
  it('out side test', () => {
    const limtBox = createBBox(100, 100, 500, 500);
    expect(getOutSides(120, 120, 50, 50, limtBox)).toEqual({
      top: false,
      bottom: false,
      left: false,
      right: false,
    });

    expect(getOutSides(80, 80, 60, 60, limtBox)).toEqual({
      top: true,
      left: true,
      right: false,
      bottom: false,
    });

    expect(getOutSides(180, 580, 60, 60, limtBox)).toEqual({
      top: false,
      left: false,
      right: false,
      bottom: true,
    });

    expect(getOutSides(80, 80, 600, 600, limtBox)).toEqual({
      top: true,
      left: true,
      right: true,
      bottom: true,
    });
  });

  it('getPointByPosition', () => {
    const x = 100;
    const y = 100;
    const width = 50;
    const height = 40;
    const offset = 10;
    expect(getPointByPosition(x, y, offset, width, height, 'left')).toEqual({
      x: 40,
      y: 80,
    });

    expect(getPointByPosition(x, y, offset, width, height, 'right')).toEqual({
      x: 110,
      y: 80,
    });

    expect(getPointByPosition(x, y, offset, width, height, 'top')).toEqual({
      x: 100 - 25,
      y: 50,
    });

    expect(getPointByPosition(x, y, offset, width, height, 'bottom')).toEqual({
      x: 100 - 25,
      y: 110,
    });
  });

  it('merge box', () => {
    const box1 = createBBox(0, 10, 100, 100);
    const box2 = createBBox(50, 60, 100, 100);
    expect(mergeBBox(box1, box2)).toEqual(createBBox(0, 10, 150, 150));
  });

  it('intersect box', () => {
    const box1 = createBBox(0, 10, 100, 100);
    const box2 = createBBox(50, 60, 100, 100);
    expect(intersectBBox(box1, box2)).toEqual(createBBox(50, 60, 50, 50));
  });

  describe('get align point', () => {
    const x = 100;
    const y = 100;
    const width = 50;
    const height = 40;
    const offset = 10;
    const limtBox = createBBox(100, 100, 500, 500);
    it('no limit', () => {
      expect(getAlignPoint(x, y, offset, width, height, 'left')).toEqual({
        x: 40,
        y: 80,
      });
    });
    it('align left', () => {
      // 左侧超出
      expect(getAlignPoint(120, 120, offset, width, height, 'left', limtBox)).toEqual({
        x: 130,
        y: 100,
      });

      // 上面, 左侧超出
      expect(getAlignPoint(120, 110, offset, width, height, 'left', limtBox)).toEqual({
        x: 130,
        y: 100,
      });
      // 上面超出
      expect(getAlignPoint(200, 110, offset, width, height, 'left', limtBox)).toEqual({
        x: 140,
        y: 100,
      });

      // 下面，左侧超出
      expect(getAlignPoint(120, 590, offset, width, height, 'left', limtBox)).toEqual({
        x: 130,
        y: 560,
      });

      // 无超出
      expect(getAlignPoint(200, 200, offset, width, height, 'left', limtBox)).toEqual({
        x: 140,
        y: 180,
      });
    });

    it('align right', () => {
      // 右超出
      expect(getAlignPoint(550, 120, offset, width, height, 'right', limtBox)).toEqual({
        x: 490,
        y: 100,
      });

      // 右超出
      expect(getAlignPoint(560, 120, offset, width, height, 'right', limtBox)).toEqual({
        x: 500,
        y: 100,
      });

      // 上面超出
      expect(getAlignPoint(200, 110, offset, width, height, 'right', limtBox)).toEqual({
        x: 210,
        y: 100,
      });
    });

    it('align top', () => {
      // 左超出
      expect(getAlignPoint(120, 200, offset, width, height, 'top', limtBox)).toEqual({
        x: 100,
        y: 150,
      });

      // 右超出
      expect(getAlignPoint(590, 200, offset, width, height, 'top', limtBox)).toEqual({
        x: 550,
        y: 150,
      });

      // 上超出
      expect(getAlignPoint(590, 120, offset, width, height, 'top', limtBox)).toEqual({
        x: 550,
        y: 130,
      });
    });

    it('align bottom', () => {
      // 左超出
      expect(getAlignPoint(120, 200, offset, width, height, 'bottom', limtBox)).toEqual({
        x: 100,
        y: 210,
      });

      // 右超出
      expect(getAlignPoint(580, 200, offset, width, height, 'bottom', limtBox)).toEqual({
        x: 550,
        y: 210,
      });

      // 未超出
      expect(getAlignPoint(200, 200, offset, width, height, 'bottom', limtBox)).toEqual({
        x: 175,
        y: 210,
      });
    });
  });
});
