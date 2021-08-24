import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '@antv/gui';

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
    startPos: [50, 50],
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
      rotateRange: [0, 85],
      rotateStep: 1,
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
