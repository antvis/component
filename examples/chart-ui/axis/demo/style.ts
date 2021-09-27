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
    subTickLine: {
      count: 4,
    },
  },
});

canvas.appendChild(linear);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const styleFolder = cfg.addFolder('样式');
styleFolder.open();
const styleCfg = {
  末尾追加刻度: false,
  子刻度数量: 4,
  轴线正方向: 'right',
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
styleFolder.add(styleCfg, '末尾追加刻度').onChange((flag) => {
  linear.update({ tickLine: { appendTick: flag } });
});
styleFolder
  .add(styleCfg, '子刻度数量', 0, 9)
  .step(1)
  .onChange((count) => {
    linear.update({ subTickLine: { count } });
  });
styleFolder.add(styleCfg, '轴线正方向', ['left', 'right']).onChange((dir) => {
  linear.update({ verticalFactor: dir === 'left' ? -1 : 1 });
});

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
styleFolder.addColor(styleCfg, '子刻度线颜色').onChange((stroke) => {
  linear.update({ subTickLine: { style: { stroke } } });
});
styleFolder
  .add(styleCfg, '子刻度线粗细', 1, 5)
  .step(1)
  .onChange((lineWidth) => {
    linear.update({ subTickLine: { style: { lineWidth } } });
  });
styleFolder
  .add(styleCfg, '子刻度线长度', 0, 10)
  .step(1)
  .onChange((len) => {
    linear.update({ subTickLine: { len } });
  });
styleFolder.addColor(styleCfg, '标签颜色').onChange((fill) => {
  linear.update({ label: { style: { default: { fill } } } });
});
styleFolder
  .add(styleCfg, '标签字号', 5, 20)
  .step(1)
  .onChange((fontSize) => {
    linear.update({ label: { style: { default: { fontSize } } } });
  });
