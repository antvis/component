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
    startPos: [20, 100],
    endPos: [260, 100],
    ticks: tickData,
    label: {
      style: {
        fontSize: 10,
      },
    },
    title: {
      content: 'date (month)',
      titleAnchor: 'end',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
      },
    },
    tickLine: {
      len: 6,
      style: {
        stroke: '#416180',
        strokeOpacity: 0.65,
        lineWidth: 0.5,
      },
    },
    subTickLine: {
      len: 4,
      count: 0,
      style: {
        stroke: '#416180',
        strokeOpacity: 0.45,
        lineWidth: 0.5,
      },
    },
  },
});
canvas.appendChild(linear);

const arc = new Arc({
  style: {
    center: [200, 400],
    radius: 100,
    ticks: tickData.map((d, idx) => ({ ...d, value: idx * step })),
    label: {
      style: {
        fontSize: 10,
      },
    },
    title: {
      content: 'date (month)',
      titleAnchor: 'end',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
      },
    },
    tickLine: {
      len: 6,
      style: {
        stroke: '#416180',
        strokeOpacity: 0.65,
        lineWidth: 0.5,
      },
    },
    subTickLine: {
      len: 4,
      count: 4,
      style: {
        stroke: '#416180',
        strokeOpacity: 0.45,
        lineWidth: 0.5,
      },
    },
  },
});
canvas.appendChild(arc);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel([linear, arc], '样式', {
  'tickLine.style.stroke': { label: '刻度线颜色', value: '#416180', type: 'color' },
  'tickLine.style.lineWidth': { label: '刻度线粗细', value: 0.5, type: 'number', step: 0.5, range: [0, 5] },
  'tickLine.len': { label: '刻度线长度', value: 6, type: 'number', step: 1, range: [0, 10] },
  'subTickLine.style.stroke': { label: '子刻度线颜色', value: '#416180', type: 'color' },
  'subTickLine.style.lineWidth': { label: '子刻度线粗细', value: 0.5, type: 'number', step: 0.5, range: [0, 5] },
  'subTickLine.len': { label: '子刻度线长度', value: 4, type: 'number', step: 1, range: [0, 10] },
  'subTickLine.count': { label: '子刻度线数量', value: 0, type: 'number', step: 1, range: [0, 8] },
});
