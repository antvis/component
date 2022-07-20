import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Arc, Linear } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 800,
  renderer,
});

const points = (x1, y1, x2, y2) => [
  [x1, y1],
  [x2, y2],
];
function getGridItems(ticks, radius, startAngle, endAngle, center) {
  return ticks.map(({ value }) => {
    const angle = (endAngle - startAngle) * value + startAngle;
    return {
      points: points(
        center[0],
        center[1],
        center[0] + radius * Math.cos((angle * Math.PI) / 180),
        center[1] + radius * Math.sin((angle * Math.PI) / 180)
      ),
    };
  });
}

const arcTicks = Array(60)
  .fill(0)
  .map((tick, idx) => {
    const step = 1 / 60;
    return { value: idx * step, text: String(idx) };
  });
const arc = new Arc({
  style: {
    startAngle: -90,
    endAngle: 270,
    radius: 100,
    center: [150, 150],
    verticalFactor: 1,
    title: {
      content: '圆弧坐标轴',
    },
    grid: {
      items: getGridItems(arcTicks, 100, -90, 270, [150, 150]),
      lineStyle: { lineDash: [0, 0] },
    },
    ticks: arcTicks,
    label: {
      align: 'radial',
      autoHide: true,
      autoHideTickLine: false,
    },
    subTickLine: { count: 1 },
  },
});

canvas.appendChild(arc);

const data = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const step = 1 / data.length;
const tickData = data.map((d, idx) => {
  return { value: step * idx, text: d, id: String(idx) };
});
const arc2 = new Arc({
  style: {
    startAngle: -90,
    endAngle: 270,
    radius: 100,
    center: [300, 420],
    verticalFactor: 1,
    grid: {
      items: getGridItems(tickData, 100, -90, 270, [300, 420]),
    },
    axisLine: null,
    ticks: tickData,
    label: {
      align: 'tangential',
      autoEllipsis: true,
      // autoHide: true,
      autoHideTickLine: false,
    },
  },
});

canvas.appendChild(arc2);

const arcYTicks = [
  { value: 0, text: '0' },
  { value: 0.25, text: '25' },
  { value: 0.5, text: '50' },
  { value: 0.75, text: '75' },
  { value: 1, text: '100' },
];

const startAngle = -90;
const endAngle = 270;
const items = arcYTicks.map((tick) => {
  const points = tickData.map(({ value }) => {
    const angle = (endAngle - startAngle) * value + startAngle;
    const r = 100 * tick.value;
    return [300 + r * Math.cos((angle * Math.PI) / 180), 420 + r * Math.sin((angle * Math.PI) / 180)];
  });
  return { points };
});

const arcY = new Linear({
  style: {
    startPos: [300, 420],
    endPos: [300, 320],
    axisLine: { arrow: { end: {} } },
    ticks: arcYTicks,
    grid: { items, closed: true },
  },
});
canvas.appendChild(arcY);
