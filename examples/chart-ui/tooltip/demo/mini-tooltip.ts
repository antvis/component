import { Canvas, Rect, Circle } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const dots = [];
const r = 5;
const getRandomPosition = (st, limit, r) => st + r + (limit - 2 * r) * Math.random();

const tooltipArea = new Rect({
  style: {
    x: 50,
    y: 50,
    width: 500,
    height: 500,
    fill: 'l(90) 0:#fb3a98 0.5:#ff5080 1:#ff5d74',
  },
});

canvas.appendChild(tooltipArea);

/* create scatter */
Array.from({ length: 300 }, () => {
  return [getRandomPosition(50, 500, r), getRandomPosition(50, 500, r)];
}).forEach(([x, y], i) => {
  const dot = new Circle({
    name: 'scatter',
    style: {
      x,
      y,
      r,
      fill: '#f9bc2e',
    },
  });
  dots.push(dot);
  canvas.appendChild(dot);
});

const tooltip = new Tooltip({
  style: {
    title: '数值',
    x: 0,
    y: 0,
    visibility: 'hidden',
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
    bounding: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
    },
    style: {
      '.tooltip': {
        'border-radius': '5px',
        'background-color': '#232c31',
        padding: '4px 8px',
        color: '#fff',
      },
    },
    customContent: (items) => {
      return `<div><b>x:</b> ${items[0].x}<br /><b>y:</b> ${items[0].y}</div>`;
    },
  },
});

// 移除之前的tooltip
Array.from(document.getElementsByClassName('tooltip')).forEach((tooltip) => tooltip.remove());
document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);

canvas.addEventListener('mousemove', (e) => {
  if (e.target && e.target.name === 'scatter') {
    e.target.attr('fill', 'white');
    tooltip.update({
      items: [
        {
          x: e.offsetX,
          y: e.offsetY,
        },
      ],
    });
    tooltip.position = [e.offsetX, e.offsetY];
    tooltip.show();
  } else {
    dots.forEach((dot) => dot.attr('fill', '#f9bc2e'));
    tooltip.hide();
  }
});

const { left, top } = document.getElementById('container').getBoundingClientRect();
tooltip.update({
  container: {
    x: left,
    y: top,
  },
});
