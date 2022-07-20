import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Band as BandScale } from '@antv/scale';
import { Linear, Arc } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 1000,
  height: 600,
  renderer,
});

const [startX, startY] = [20, 280];
const [endX, endY] = [260, 280];

const domain = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const scale = new BandScale({ domain });
const ticks = domain.map((tick) => ({ value: scale.map(tick) + scale.getBandWidth(tick) / 2, text: tick }));

const points = (x1, y1, x2, y2) => [
  [x1, y1],
  [x2, y2],
];
function getGridItems(x1: number, y1: number, x2: number, y2: number) {
  const gridItems = [];
  gridItems.push({ points: points(x1, y1, x1, y2) });
  for (let idx = 0; idx < domain.length - 1; idx++) {
    const x = ((scale.map(domain[idx]) + scale.getBandWidth(domain[idx]) + scale.map(domain[idx + 1])) / 2) * (x2 - x1);
    gridItems.push({ points: points(x1 + x, y1, x1 + x, y2) });
  }
  gridItems.push({ points: points(x2, y1, x2, y2) });

  return gridItems;
}

const gridItems = getGridItems(startX, startY, endX, startY - 100);

const linear = new Linear({
  style: {
    startPos: [startX, startY],
    endPos: [endX, endY],
    ticks,
    title: {
      content: 'date month',
      titleAnchor: 'end',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
      },
    },
    grid: {
      items: gridItems,
      alternateColor: '#efefef',
    },
    axisLine: {
      style: {
        stroke: '#416180',
        lineWidth: 0.5,
        strokeOpacity: 0.85,
      },
      arrow: {
        start: null,
        end: null,
      },
    },
    label: {
      style: {
        fontSize: 10,
      },
    },
  },
});
canvas.appendChild(linear);

const radius = 100;
const startAngle = -90;
const endAngle = 270;
const arcGridItems = ticks.map(({ value }, idx) => {
  const angle = (endAngle - startAngle) * value + startAngle;
  return {
    points: points(
      200,
      480,
      200 + radius * Math.cos((angle * Math.PI) / 180),
      480 + radius * Math.sin((angle * Math.PI) / 180)
    ),
  };
});

const arc = new Arc({
  style: {
    center: [200, 480],
    radius: 100,
    startAngle: -90,
    endAngle: 270,
    ticks,
    grid: {
      items: arcGridItems,
    },
    title: {
      content: 'date month',
      titleAnchor: 'end',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
      },
    },
    axisLine: {
      style: {
        stroke: '#416180',
        lineWidth: 0.5,
        strokeOpacity: 0.85,
      },
      arrow: {
        start: null,
        end: null,
      },
    },
    label: {
      style: {
        fontSize: 10,
      },
    },
  },
});
canvas.appendChild(arc);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel(linear, 'Linear axis line', {
  'axisLine.style.stroke': { label: '轴线描边色', value: '#416180', type: 'color' },
  'axisLine.style.lineWidth': { label: '轴线粗细', value: 0.5, type: 'number', step: 0.5, range: [0, 5] },
  'axisLine.arrow.start': {
    label: '轴线起始箭头',
    value: '关闭',
    options: [
      { name: '关闭', value: null },
      { name: '开启', value: {} },
    ],
  },
  'axisLine.arrow.end': {
    label: '轴线终止箭头',
    value: '关闭',
    options: [
      { name: '关闭', value: null },
      { name: '开启', value: {} },
    ],
  },
});

window.ConfigPanel(
  arc,
  'Arc axis line',
  {
    'axisLine.style.stroke': { label: '轴线描边色', value: '#416180', type: 'color' },
    'axisLine.style.lineWidth': { label: '轴线粗细', value: 0.5, type: 'number', step: 0.5, range: [0, 5] },
  },
  { closed: true }
);
