import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip, Sparkline } from '../../../../src';
import { createDiv } from '../../../utils';

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

const tooltipArea = new Rect({
  style: {
    x: 50,
    y: 50,
    width: 500,
    height: 500,
    fill: '#a6ec9a',
  },
});

canvas.appendChild(tooltipArea);

// 创建自定义组件的容器
const customElement = document.createElement('div');
const innerCanvas = new Canvas({
  container: customElement,
  width: 100,
  height: 50,
  renderer,
});
const sparkline = new Sparkline({
  style: {
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    smooth: true,
    data: [
      [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
      [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
      [-10, 3, 4, 10, 15, 13, 3, 3, 0, 12],
    ],
  },
});
innerCanvas.appendChild(sparkline);

const tooltip = new Tooltip({
  id: 'custom-tooltip',
  style: {
    title: '数值',
    x: 0,
    y: 0,
    offset: [10, 10],
    position: 'bottom-right',
    autoPosition: true,
    container: {
      x: 0,
      y: 0,
    },
    items: [
      {
        value: 0,
        name: '第一项',
        index: 0,
        color: 'red',
      },
    ],
    bounding: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
    },
    style: {
      '.tooltip': {
        'border-radius': '5px',
      },
      canvas: {
        'vertical-align': 'middle',
      },
    },
    customContent: () => {
      return customElement;
    },
  },
});

document.getElementsByTagName('body')[0]!.appendChild(tooltip.HTMLTooltipElement);

describe('tooltip', () => {
  test('basic', async () => {
    const sparklineCanvasElement = document.getElementById('custom-tooltip')!.getElementsByTagName('canvas')[0];
    expect(sparklineCanvasElement.style.width).toBe('100px');
    expect(sparklineCanvasElement.style.height).toBe('50px');
  });
});
