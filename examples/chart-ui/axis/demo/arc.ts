import { Canvas, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Arc } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 800,
  renderer,
});

const arc = new Arc({
  style: {
    container: canvas.appendChild(new Group()),
    startAngle: -90,
    endAngle: 270,
    radius: 100,
    center: [150, 150],
    verticalFactor: 1,
    title: {
      content: '圆弧坐标轴',
    },
    ticks: Array(60)
      .fill(0)
      .map((tick, idx) => {
        const step = 1 / 60;
        return { value: idx * step, text: String(idx) };
      }),
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
  return { value: step * idx + step / 2, text: d, id: String(idx) };
});
const arc2 = new Arc({
  style: {
    container: canvas.appendChild(new Group()),
    startAngle: -90,
    endAngle: 270,
    radius: 100,
    center: [300, 420],
    verticalFactor: 1,
    title: {
      content: '圆弧坐标轴',
    },
    ticks: tickData,
    label: {
      align: 'tangential',
      autoEllipsis: true,
      // autoHide: true,
      autoHideTickLine: false,
    },
    subTickLine: { count: 1 },
  },
});

canvas.appendChild(arc);
canvas.appendChild(arc2);

window.ConfigPanel([arc, arc2], '样式', {
  'subTickLine.style.lineWidth': { label: '子刻度线粗细', value: 0.5, type: 'number', step: 0.5, range: [0, 5] },
  startAngle: { label: '起始角', value: -90, type: 'number', step: 1, range: [-90, 180] },
  endAngle: { label: '终止角', value: 270, type: 'number', step: 1, range: [-0, 270] },
  radius: { label: '半径', value: 150, type: 'number', step: 1, range: [50, 200] },
  verticalFactor: {
    label: '轴线正方向',
    value: 'outer',
    options: [
      { name: 'outer', value: 1 },
      { name: 'inner', value: -1 },
    ],
  },
  'label.align': {
    label: '标签与轴线对齐方式',
    value: 'radial',
    options: ['normal', { name: '径向', value: 'radial' }, { name: '切线方向', value: 'tangential' }],
  },
});
