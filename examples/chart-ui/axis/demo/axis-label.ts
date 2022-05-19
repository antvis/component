import { Canvas, Group, Path } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
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

const data = [
  'Design',
  'Development',
  'Marketing',
  'Users',
  'Language',
  'Technology',
  'Support',
  'Sales',
  'UX',
  'Test',
];
const step = 1 / data.length;
const tickData = data.map((d, idx) => {
  return { value: step * idx + step / 2, text: d, id: String(idx) };
});

const linear = new Linear({
  style: {
    startPos: [20, 280],
    endPos: [420, 280],
    ticks: tickData,
    title: {
      content: 'Department',
      titleAnchor: 'end',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
      },
    },
    label: {
      autoEllipsis: true,
      tickPadding: 2,
      minLength: 14,
      maxLength: 160,
      rotate: 18,
      margin: [0, 2, 0, 0],
      style: {
        fontSize: 10,
        fill: 'black',
        fillOpacity: 0.65,
      },
    },
    verticalFactor: 1,
  },
});
canvas.appendChild(linear);

const arc = new Arc({
  style: {
    center: [200, 480],
    radius: 100,
    ticks: tickData.map((d, idx) => ({ ...d, value: idx * step })),
    title: {
      content: 'Department',
      titleAnchor: 'end',
      style: {
        fontSize: 10,
        fontWeight: 'bold',
      },
    },
    label: {
      autoEllipsis: true,
      tickPadding: 2,
      minLength: 14,
      maxLength: 160,
      style: {
        fontSize: 10,
        fill: 'black',
        fillOpacity: 0.65,
      },
    },
    verticalFactor: 1,
  },
});
canvas.appendChild(arc);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel(linear, 'Linear axis label', {
  'label.autoEllipsis': { label: '自动省略', value: true },
  'label.minLength': { label: '最小长度', value: 10, type: 'number', step: 2, range: [14, 20] },
  'label.maxLength': { label: '最大长度', value: 160, type: 'number', step: 2, range: [20, 400] },
  'label.tickPadding': { label: '标签与刻度线距离', value: 2, type: 'number', step: 1, range: [0, 10] },
  'label.rotate': { label: '标签旋转角度', value: 18, type: 'number', step: 1, range: [-90, 90] },
  'label.style.fontSize': { label: '标签字体大小', value: 10, type: 'number', step: 1, range: [0, 40] },
  'label.style.fontWeight': { label: '标签字重', value: 'normal', options: ['normal', 'bold'] },
  'label.style.fill': { label: '标签字体颜色', value: '#000', type: 'color' },
});

window.ConfigPanel(
  arc,
  'Arc axis label',
  {
    'label.autoEllipsis': { label: '自动省略', value: true },
    'label.minLength': { label: '最小长度', value: 10, type: 'number', step: 2, range: [14, 20] },
    'label.maxLength': { label: '最大长度', value: 160, type: 'number', step: 2, range: [20, 400] },
    'label.tickPadding': { label: '标签与刻度线距离', value: 2, type: 'number', step: 1, range: [0, 10] },
    'label.style.fontSize': { label: '标签字体大小', value: 10, type: 'number', step: 1, range: [0, 40] },
    'label.style.fontWeight': { label: '标签字重', value: 'normal', options: ['normal', 'bold'] },
    'label.style.fill': { label: '标签字体颜色', value: '#000', type: 'color' },
  },
  { closed: true }
);
