import { throttle } from '@antv/util';
import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip, Sparkline } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
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

const tooltip = new Tooltip({
  style: {
    title: '数值',
    x: 0,
    y: 0,
    offset: [10, 10],
    position: 'bottom-right',
    autoPosition: true,
    items: [
      {
        value: 0,
        name: '第一项',
        index: 0,
        color: 'red',
      },
    ],
    parent: document.getElementById('container').firstChild,
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
    },
    customContent: () => {
      return customElement;
    },
  },
});

// 移除之前的tooltip
Array.from(document.getElementsByClassName('tooltip')).forEach((tooltip) => tooltip.remove());
document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
const mousemove = throttle(
  (e) => {
    tooltip.position = [e.offsetX, e.offsetY];
  },
  100,
  {}
);

canvas.addEventListener('mousemove', (e) => {
  mousemove(e);
});
canvas.addEventListener('mouseenter', () => {
  tooltip.show();
});
canvas.addEventListener('mouseleave', () => {
  tooltip.hide();
});
