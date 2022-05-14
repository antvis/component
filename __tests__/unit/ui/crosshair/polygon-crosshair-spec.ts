import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { PolygonCrosshair } from '../../../../src';
import { createDiv } from '../../../utils';
import { delay } from '../../../utils/delay';

const renderer = new Renderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
  // enableTAA: false,
});

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 500,
  height: 500,
  renderer,
});

let [cx, cy] = [250, 250];
const defaultRadius = 50;
const t1 = Math.cos(Math.PI / 6) * 50;

const polygon = new PolygonCrosshair({
  style: {
    defaultRadius,
    center: [cx, cy],
    sides: 6,
    lineStyle: {
      lineWidth: 2,
    },
  },
});
canvas.appendChild(polygon);

describe('polygon-crosshair', () => {
  test('basic', async () => {
    // @ts-ignore
    const path = polygon.crosshairShape.attr('path');
    // @ts-ignore
    polygon.points.forEach(([x, y], index) => {
      expect(x ** 2 + y ** 2).toBeCloseTo(1);
      const [px, py] = path![index].slice(1) as [number, number];
      expect(cx + x * defaultRadius).toBeCloseTo(px);
      expect(cx + y * defaultRadius).toBeCloseTo(py);
    });
  });

  test('update', () => {
    [cx, cy] = [100, 100];
    polygon.update({
      center: [cx, cy],
    });
    // @ts-ignore
    polygon.points.forEach(([x, y]) => {
      expect(x ** 2 + y ** 2).toBeCloseTo(1);
    });
  });

  test('setPointer', async () => {
    // 等效半径 100
    polygon.setPointer([200, 100]);
    await delay(20);
    // @ts-ignore
    const path = polygon.crosshairShape.attr('path');
    // @ts-ignore
    polygon.points.forEach(([x, y], index) => {
      const [px, py] = path![index].slice(1) as [number, number];
      expect(cx + x * 100).toBeCloseTo(px);
      expect(cx + y * 100).toBeCloseTo(py);
    });
  });

  afterAll(() => {
    polygon.destroy();
  });
});
