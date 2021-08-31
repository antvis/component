import { throttle } from '@antv/util';
import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip } from '@antv/gui';

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
        'border-radius': '20px',
      },
    },
    customContent: (items) => {
      return `<div>${items[0].name}</div>`;
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
