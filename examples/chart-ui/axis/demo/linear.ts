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
    state: 'default',
    id: String(idx),
  };
});

const linear = new Linear({
  style: {
    startPos: [0, 50],
    endPos: [800, 50],
    ticks: tickData,
    title: {
      content: '直线坐标轴',
      offset: [0, -20],
    },
    label: {
      offset: [0, 15],
      minLength: 20,
      maxLength: 80,
      autoEllipsis: false,
      optionalAngles: [20, 30, 45],
      padding: [0, 0, 0, 0],
      autoHide: false,
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

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);

const getDefaultLabelCfg = ({
  fill = labelColor.getValue(),
  fontSize = labelFontSize.getValue(),
  autoHide = labelAutoHide.getValue(),
  minLabel = labelMin.getValue(),
  autoEllipsis = labelAutoEllipsis.getValue(),
  minLength = labelMinLength.getValue(),
  maxLength = labelMaxLength.getValue(),
  autoRotate = labelAutoRotate.getValue(),
  maniRotate = labelManiRotate.getValue(),
  rotate = labelRotate.getValue(),
  alignTick = labelAlignTick.getValue(),
}) => {
  if (!showLabel.getValue()) showLabel.setValue(true);
  return {
    type: 'text',
    style: {
      default: {
        fill,
        fontSize,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    },
    alignTick,
    formatter: (tick) => tick.text || String(tick.value || ''),
    overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
    margin: [0, 0, 0, 0],
    rotate: maniRotate ? rotate : undefined,
    autoRotate,
    autoHideTickLine: true,
    minLabel,
    ellipsisStep: ' ',
    offset: [0, 15],
    minLength,
    maxLength,
    autoEllipsis,
    optionalAngles: [20, 30, 45],
    padding: [0, 0, 0, 0],
    autoHide,
  };
};

const getDefaultSubTickLineCfg = ({
  count = subTickCount.getValue(),
  stroke = subTickLineColor.getValue(),
  lineWidth = subTickLineWidth.getValue(),
  len = subTickLineLen.getValue(),
}) => {
  if (!showSubTick.getValue()) showSubTick.setValue(true);
  return {
    len,
    count,
    offset: 0,
    style: {
      default: {
        stroke,
        lineWidth,
      },
    },
  };
};

const layoutFolder = cfg.addFolder('布局');
layoutFolder.open();
const layoutCfg = {
  x: 0,
  y: 0,
  显示标签: true,
  末尾追加刻度: false,
  显示子刻度: false,
  子刻度数量: 4,
  轴线正方向: 'left',
};

layoutFolder.add(layoutCfg, 'x', 0, 200).onChange((x) => {
  linear.update({ x });
});
layoutFolder.add(layoutCfg, 'y', 0, 200).onChange((y) => {
  linear.update({ y });
});
const showLabel = layoutFolder.add(layoutCfg, '显示标签').onChange((flag) => {
  linear.update({ label: flag ? getDefaultLabelCfg({}) : false });
});
layoutFolder.add(layoutCfg, '末尾追加刻度').onChange((flag) => {
  linear.update({ tickLine: { appendTick: flag } });
});
const showSubTick = layoutFolder.add(layoutCfg, '显示子刻度').onChange((flag) => {
  linear.update({ subTickLine: flag ? getDefaultSubTickLineCfg({}) : false });
});
const subTickCount = layoutFolder
  .add(layoutCfg, '子刻度数量', 0, 9)
  .step(1)
  .onChange((count) => {
    linear.update({ subTickLine: getDefaultSubTickLineCfg({ count }) });
  });
layoutFolder.add(layoutCfg, '轴线正方向', ['left', 'right']).onChange((dir) => {
  linear.update({ verticalFactor: dir === 'left' ? 1 : -1 });
});

const styleFolder = cfg.addFolder('样式');
styleFolder.open();
const styleCfg = {
  标题颜色: '#000',
  标题字号: 12,
  轴线颜色: '#000',
  轴线粗细: 2,
  刻度线颜色: '#000',
  刻度线粗细: 2,
  子刻度线颜色: '#000',
  子刻度线粗细: 2,
  子刻度线长度: 5,
  标签颜色: '#000',
  标签字号: 12,
};
styleFolder.addColor(styleCfg, '标题颜色').onChange((fill) => {
  linear.update({ title: { style: { fill } } });
});
styleFolder.add(styleCfg, '标题字号', 5, 20).onChange((fontSize) => {
  linear.update({ title: { style: { fontSize } } });
});
styleFolder.addColor(styleCfg, '轴线颜色').onChange((color) => {
  linear.update({ axisLine: { style: { stroke: color } } });
});
styleFolder
  .add(styleCfg, '轴线粗细', 1, 5)
  .step(1)
  .onChange((lineWidth) => {
    linear.update({ axisLine: { style: { lineWidth } } });
  });
const subTickLineColor = styleFolder.addColor(styleCfg, '子刻度线颜色').onChange((stroke) => {
  linear.update({ subTickLine: getDefaultSubTickLineCfg({ stroke }) });
});
const subTickLineWidth = styleFolder
  .add(styleCfg, '子刻度线粗细', 1, 5)
  .step(1)
  .onChange((lineWidth) => {
    linear.update({ subTickLine: getDefaultSubTickLineCfg({ lineWidth }) });
  });
const subTickLineLen = styleFolder
  .add(styleCfg, '子刻度线长度', 0, 10)
  .step(1)
  .onChange((len) => {
    linear.update({ subTickLine: getDefaultSubTickLineCfg({ len }) });
  });
const labelColor = styleFolder.addColor(styleCfg, '标签颜色').onChange((fill) => {
  linear.update({ label: getDefaultLabelCfg({ fill }) });
});
const labelFontSize = styleFolder
  .add(styleCfg, '标签字号', 5, 20)
  .step(1)
  .onChange((fontSize) => {
    linear.update({ label: getDefaultLabelCfg({ fontSize }) });
  });

const labelFolder = cfg.addFolder('标签');
labelFolder.open();
const labelCfg = {
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
const labelRotate = labelFolder.add(labelCfg, '旋转角度', -90, 90).onChange((rotate) => {
  linear.update({ label: getDefaultLabelCfg({ rotate }) });
});
const labelAlignTick = labelFolder.add(labelCfg, '对齐刻度').onChange((alignTick) => {
  linear.update({ label: getDefaultLabelCfg({ alignTick }) });
});
