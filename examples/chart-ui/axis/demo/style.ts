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
    label: {
      offset: 4,
      rotation: 28,
      autoHide: false,

      // 文本发生 overlap 时，自动省略的最大、最小文本长度限制（minLength 适用于避免出现 '...' 的情形）
      minLength: 15,
      maxLength: 80,
      autoEllipsis: true,
      // 垂直轴方向的限制, 适用于存在自动旋转或者指定旋转的情况
      verticalLimitLength: 50,

      optionalAngles: [20, 30, 45],
      padding: [0, 0, 0, 0],
    },
    title: {
      content: '坐标轴',
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
  标题颜色透明度: 0.45,
  标题字号: 12,
  轴线颜色: '#000',
  轴线粗细: 2,
  刻度线颜色: '#416180',
  刻度线粗细: 0.5,
  刻度线长度: 6,
  子刻度线颜色: '#416180',
  子刻度线粗细: 0.5,
  子刻度线长度: 4,
  标签颜色: '#000',
  标签颜色透明度: 0.65,
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
styleFolder.addColor(styleCfg, '标题颜色透明度').onChange((fillOpacity) => {
  linear.update({ title: { style: { fillOpacity } } });
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
styleFolder.addColor(styleCfg, '刻度线颜色').onChange((stroke) => {
  linear.update({ tickLine: { style: { stroke } } });
});
styleFolder
  .add(styleCfg, '刻度线粗细', 1, 5)
  .step(1)
  .onChange((lineWidth) => {
    linear.update({ tickLine: { style: { lineWidth } } });
  });
styleFolder
  .add(styleCfg, '刻度线长度', 0, 10)
  .step(1)
  .onChange((len) => {
    linear.update({ tickLine: { len } });
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
  linear.update({ label: { style: { fill } } });
});
styleFolder.addColor(styleCfg, '标签颜色透明度').onChange((fillOpacity) => {
  linear.update({ label: { style: { fillOpacity } } });
});

styleFolder
  .add(styleCfg, '标签字号', 5, 20)
  .step(1)
  .onChange((fontSize) => {
    linear.update({ label: { style: { fontSize } } });
  });
