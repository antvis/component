import { throttle } from '@antv/util';
import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip, Sparkline } from '../../../../src';
import { createDiv } from '../../../utils';

Array.from(document.getElementsByClassName('tooltip')).forEach((tooltip) => {
  tooltip.remove();
});

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();
const canvas = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

/* 创建背景 */
canvas.appendChild(
  new Rect({
    style: {
      x: 0,
      y: 0,
      height: 600,
      width: 600,
      lineWidth: 1,
      fill: '#ddd',
      stroke: 'black',
    },
  })
);

/* 边界区域 */
canvas.appendChild(
  new Rect({
    style: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
      fill: 'lightgreen',
    },
  })
);

const customElement = createDiv();
const innerCanvas = new Canvas({
  container: customElement,
  width: 100,
  height: 50,
  renderer,
});

const sparkline = new Sparkline({
  style: {
    x: 10,
    y: 10,
    width: 300,
    height: 50,
    smooth: false,
    data: [
      [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
      [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
      [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
    ],
  },
});
innerCanvas.appendChild(sparkline);

describe('tooltip', () => {
  test('basic', async () => {
    const tooltip = new Tooltip({
      id: 'custom-tooltip',
      style: {
        title: '数值',
        x: 100,
        y: 100,
        offset: [10, 10],
        position: 'bottom-right',
        autoPosition: true,
        items: [],
        parent: document.getElementsByTagName('canvas')[0],
        bounding: {
          x: 50,
          y: 50,
          width: 500,
          height: 500,
        },
        style: {
          '.tooltip': {
            'border-radius': '5px',
            padding: '5px',
          },
        },
        customContent: () => {
          return customElement;
        },
      },
    });

    document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
    const mousemove = throttle(
      (e: MouseEvent) => {
        const { offsetX, offsetY } = e;
        tooltip.position = [offsetX, offsetY];

        if (offsetX > 300) {
          sparkline.update({
            data: [
              [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
              [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
            ],
          });
        } else {
          sparkline.update({
            data: [
              [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
              [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
              [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
            ],
          });
        }
      },
      100,
      {}
    );

    canvas.addEventListener('mousemove', (e: Event) => {
      mousemove(e);
    });
    canvas.addEventListener('mouseenter', () => {
      tooltip.show();
    });
    canvas.addEventListener('mouseleave', () => {
      tooltip.hide();
    });

    const tooltipElement = document.getElementById('custom-tooltip')!;
    const tooltipCanvas = tooltipElement.getElementsByTagName('canvas')[0]!;
    expect(tooltipCanvas.style.width).toBe('100px');
    expect(tooltipCanvas.style.height).toBe('50px');
  });
});
