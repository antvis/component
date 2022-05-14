import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { CircleCrosshair } from '../../../../src';
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

const circle = new CircleCrosshair({
  style: {
    center: [250, 250],
    defaultRadius: 50,
    lineStyle: {
      lineWidth: 2,
    },
  },
});
canvas.appendChild(circle);

describe('circle-crosshair', () => {
  test('basic', async () => {
    // @ts-ignore
    expect(circle.crosshairShape.attr('path')).toStrictEqual([
      ['M', 200, 250],
      ['A', 50, 50, 0, 1, 0, 300, 250],
      ['A', 50, 50, 0, 1, 0, 200, 250],
    ]);
  });

  test('update', () => {
    circle.update({
      center: [50, 50],
    });
    // @ts-ignore
    expect(circle.crosshairShape.attr('path')).toStrictEqual([
      ['M', 0, 50],
      ['A', 50, 50, 0, 1, 0, 100, 50],
      ['A', 50, 50, 0, 1, 0, 0, 50],
    ]);
  });

  test('setPointer', async () => {
    // r = 100
    circle.setPointer([50, 150]);
    await delay(20);
    // @ts-ignore
    expect(circle.crosshairShape.attr('path')).toStrictEqual([
      ['M', -50, 50],
      ['A', 100, 100, 0, 1, 0, 150, 50],
      ['A', 100, 100, 0, 1, 0, -50, 50],
    ]);
  });

  afterAll(() => {
    circle.destroy();
  });
});
