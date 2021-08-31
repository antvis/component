import { throttle } from '@antv/util';
import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip } from '../../../../src';
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
  width: 800,
  height: 800,
  renderer,
});

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

describe('tooltip', () => {
  test('basic', async () => {
    const tooltip = new Tooltip({
      id: 'mini-tooltip',
      style: {
        title: '数值',
        x: 100,
        y: 100,
        offset: [10, 10],
        position: 'bottom-right',
        // autoPosition: true,
        items: [
          {
            value: 0,
            name: '第一项',
            index: 0,
            color: 'red',
          },
        ],
        parent: document.getElementsByTagName('canvas')[0],
        bounding: {
          x: 50,
          y: 50,
          width: 500,
          height: 500,
        },
        style: {
          '.tooltip': {
            'border-radius': '20px',
          },
        },
        customContent: (items) => {
          return `<div>${items[0].name}</div>`;
        },
      },
    });

    document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
    const mousemove = throttle(
      (e: MouseEvent) => {
        const { offsetX, offsetY } = e;
        tooltip.position = [offsetX, offsetY];
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

    const customElement = document.getElementById('mini-tooltip')!;
    expect(customElement.style.borderRadius).toBe('20px');
    expect(customElement.innerText).toBe('第一项');
  });
});
