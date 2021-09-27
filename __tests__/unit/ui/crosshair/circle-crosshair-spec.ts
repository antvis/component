import { Canvas } from '@antv/g';
import { Renderer as SVGRenderer } from '@antv/g-svg';
import { CircleCrosshair } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new SVGRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
  enableTAA: false,
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

  test('setPointer', () => {
    // r = 100
    circle.setPointer([50, 150]);

    // @ts-ignore
    expect(circle.crosshairShape.attr('path')).toStrictEqual([
      ['M', -50, 50],
      ['A', 100, 100, 0, 1, 0, 150, 50],
      ['A', 100, 100, 0, 1, 0, -50, 50],
    ]);
  });
});
