import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Icon } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('icon', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const icon = new Icon({
      attrs: {
        symbol: 'triangle-down',
        x: 50,
        y: 50,
        size: 10,
        spacing: 4,
        fill: 'green',
        text: '10.24%',
      },
    });

    canvas.appendChild(icon);
  });
});
