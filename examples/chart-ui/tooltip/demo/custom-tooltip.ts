import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip, Sparkline } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const color = ['#72e5cf', '#ff5d74', '#f9bc2e'];
const data = [
  [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
  [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
  [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
];

/* 边界区域 */
const tooltipArea = new Rect({
  style: {
    x: 50,
    y: 50,
    width: 500,
    height: 200,
    lineWidth: 1,
    fill: '#eee',
    stroke: '#000',
  },
});
canvas.appendChild(tooltipArea);

tooltipArea.appendChild(
  new Sparkline({
    style: {
      data,
      color,
      x: 0,
      y: 0,
      width: 500,
      height: 200,
      smooth: false,
    },
  })
);

// 创建自定义组件的容器
const customElement = document.createElement('div');
const innerCanvas = new Canvas({
  container: customElement,
  width: 100,
  height: 80,
  renderer,
});
data.forEach((datum, idx) => {
  innerCanvas.appendChild(
    new Sparkline({
      style: {
        x: 0,
        y: 30 * idx,
        width: 100,
        height: 20,
        areaStyle: {
          opacity: 0.5,
        },
        color: color[idx],
        data: [datum],
      },
    })
  );
});

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
    bounding: {
      x: 50,
      y: 50,
      width: 500,
      height: 200,
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
canvas.addEventListener('mousemove', (e) => {
  tooltip.position = [e.offsetX, e.offsetY];
});
tooltipArea.addEventListener('mouseenter', () => {
  tooltip.show();
});
tooltipArea.addEventListener('mouseleave', () => {
  tooltip.hide();
});

const { left, top } = document.getElementById('container').getBoundingClientRect();
tooltip.update({
  container: {
    x: left,
    y: top,
  },
});
