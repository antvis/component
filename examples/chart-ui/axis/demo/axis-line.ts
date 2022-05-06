import { Canvas, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
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

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const step = 1 / data.length;
const tickData = data.map((d, idx) => {
  return { value: step * idx + step / 2, text: d, id: String(idx) };
});

const linear = new Linear({
  style: {
    startPos: [20, 280],
    endPos: [260, 280],
    ticks: tickData,
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
canvas.appendChild(linear);

const arc = new Arc({
  style: {
    center: [200, 480],
    radius: 100,
    ticks: tickData.map((d, idx) => ({ ...d, value: idx * step })),
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
