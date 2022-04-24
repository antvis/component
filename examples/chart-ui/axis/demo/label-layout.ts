import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '@antv/gui';
import * as dat from 'dat.gui';

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
    value: step * idx,
    text: d,
    id: String(idx),
  };
});

const linear = new Linear({
  style: {
    startPos: [0, 50],
    endPos: [800, 50],
    ticks: tickData,
    title: {},
    label: {
      minLength: 20,
      maxLength: 80,
      autoRotate: true,
      autoHide: false,
      autoEllipsis: false,
      optionalAngles: [20, 30, 45],
      padding: [0, 0, 0, 0],
      offset: 4,
    },
    tickLine: {
      appendTick: false,
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

canvas.appendChild(linear);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);

const getDefaultLabelCfg = ({
  fontSize = labelFontSize.getValue(),
  autoHide = labelAutoHide.getValue(),
  minLabel = labelMin.getValue(),
  autoEllipsis = labelAutoEllipsis.getValue(),
  minLength = labelMinLength.getValue(),
  maxLength = labelMaxLength.getValue(),
  autoRotate = labelAutoRotate.getValue(),
  maniRotate = labelManiRotate.getValue(),
  rotation = labelRotate.getValue(),
  alignTick = labelAlignTick.getValue(),
}) => {
  return {
    type: 'text',
    style: {
      fill: '#000',
      fontSize,
      textAlign: 'center',
      textBaseline: 'middle',
    },
    alignTick,
    formatter: (tick) => tick.text || String(tick.value || ''),
    overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
    margin: [0, 0, 0, 0],
    rotation: maniRotate ? rotation : undefined,
    autoRotate,
    autoHideTickLine: true,
    minLabel,
    ellipsisStep: ' ',
    minLength,
    maxLength,
    autoEllipsis,
    optionalAngles: [20, 30, 45],
    padding: [0, 0, 0, 0],
    autoHide,
  };
};

const labelFolder = cfg.addFolder('标签布局');
labelFolder.open();
const labelCfg = {
  标签字号: 12,
  自动隐藏: true,
  最少标签数量: 1,
  自动省略: true,
  最小缩略长度: 20,
  标签最大长度: 80,
  自动旋转: true,
  指定角度: false,
  旋转角度: 0,
  对齐刻度: true,
};
const labelFontSize = labelFolder
  .add(labelCfg, '标签字号', 5, 20)
  .step(1)
  .onChange((fontSize) => {
    linear.update({ label: getDefaultLabelCfg({ fontSize }) });
  });
const labelAutoHide = labelFolder.add(labelCfg, '自动隐藏').onChange((autoHide) => {
  linear.update({ label: getDefaultLabelCfg({ autoHide }) });
});
const labelMin = labelFolder
  .add(labelCfg, '最少标签数量', 1, 5)
  .step(1)
  .onChange((minLabel) => {
    linear.update({ label: getDefaultLabelCfg({ minLabel }) });
  });
const labelAutoEllipsis = labelFolder.add(labelCfg, '自动省略').onChange((autoEllipsis) => {
  linear.update({ label: getDefaultLabelCfg({ autoEllipsis }) });
});
const labelMinLength = labelFolder
  .add(labelCfg, '最小缩略长度', 20, 100)
  .step(5)
  .onChange((minLength) => {
    linear.update({ label: getDefaultLabelCfg({ minLength }) });
  });
const labelMaxLength = labelFolder
  .add(labelCfg, '标签最大长度', 20, 200)
  .step(5)
  .onChange((maxLength) => {
    linear.update({ label: getDefaultLabelCfg({ maxLength }) });
  });
const labelAutoRotate = labelFolder.add(labelCfg, '自动旋转').onChange((autoRotate) => {
  linear.update({ label: getDefaultLabelCfg({ autoRotate }) });
});
const labelManiRotate = labelFolder.add(labelCfg, '指定角度').onChange((maniRotate) => {
  linear.update({ label: getDefaultLabelCfg({ maniRotate }) });
});
const labelRotate = labelFolder.add(labelCfg, '旋转角度', -90, 90).onChange((rotation) => {
  linear.update({ label: getDefaultLabelCfg({ rotation }) });
});
const labelAlignTick = labelFolder.add(labelCfg, '对齐刻度').onChange((alignTick) => {
  linear.update({ label: getDefaultLabelCfg({ alignTick }) });
});
