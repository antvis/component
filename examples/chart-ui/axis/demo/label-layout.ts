import { Canvas, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 1000,
  height: 600,
  renderer,
});

const data = [
  '蚂蚁技术研究院',
  '智能资金',
  '蚂蚁消金',
  '合规线',
  '战略线',
  '商业智能线',
  'CFO线',
  'CTO线',
  '投资线',
  'GR线',
  '社会公益及绿色发展事业群',
  '阿里妈妈事业群',
  'CMO线',
  '大安全',
  '天猫事业线',
  '影业',
  'OceanBase',
  '投资基金线',
  '阿里体育',
  '智能科技事业群',
];

const tickData = data.map((d, idx) => {
  const step = 1 / data.length;
  return {
    value: step * idx + step / 2,
    text: d,
    id: String(idx),
  };
});

const axis = new Linear({
  style: {
    startPos: [0, 300],
    endPos: [600, 300],
    ticks: tickData,
    title: {
      content: 'Axis title',
    },
    label: {
      minLength: 20,
      maxLength: 80,
      autoRotate: true,
      autoHide: false,
      autoHideTickLine: true,
      autoEllipsis: false,
      optionalAngles: [20, 30, 45],
      margin: [0, 0, 0, 0],
      overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
    },
    axisLine: {
      arrow: {
        end: {
          symbol: 'axis-arrow',
          size: 10,
        },
      },
    },
    subTickLine: false,
  },
});

canvas.appendChild(axis);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel(axis, '样式', {
  'label.style.fontSize': { label: '标签字号', value: 10, type: 'number', step: 1, range: [5, 30] },
  'label.margin': {
    label: '标签左右间距',
    value: '[0,0]',
    options: [
      { name: '[0,0]', value: [0, 0] },
      { name: '[0,2,0,2]', value: [0, 2, 0, 2] },
      { name: '[0,4,0,4]', value: [0, 4, 0, 4] },
    ],
  },
  'label.autoRotate': { label: '自动旋转', value: true },
  'label.autoEllipsis': { label: '自动省略', value: false },
  'label.minLength': { label: '最小缩略长度', value: 20, type: 'number', step: 1, range: [20, 40] },
  'label.maxLength': { label: '标签最大长度', value: 80, type: 'number', step: 1, range: [20, 120] },
  'label.autoHide': { label: '自动隐藏', value: false },
  'label.autoHideTickLine': { label: '自动隐藏刻度线', value: true },
});
// const labelMin = labelFolder
//   .add(labelCfg, '最少标签数量', 1, 5)
//   .step(1)
//   .onChange((minLabel) => {
//     axis.update({ label: getDefaultLabelCfg({ minLabel }) });
//   });
