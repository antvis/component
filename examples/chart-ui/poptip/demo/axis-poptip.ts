import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip, Linear } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

// todo 坐标轴 label 的 poptip
const data = [
  '蚂蚁技术研究院',
  '智能资金',
  '蚂蚁消金',
  '合规线',
  '战略线',
  '商业智能线',
  '社会公益及绿色发展事业群',
  'CFO线',
  'CTO线',
  '投资线',
  'GR线',
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
    startPos: [10, 50],
    endPos: [400, 50],
    ticks: tickData,
    title: {},
    label: {
      offset: [0, 15],
      minLength: 20,
      maxLength: 80,
      autoEllipsis: true,
      optionalAngles: [20, 30, 45],
      padding: [0, 0, 0, 0],
      autoHide: false,
      style: {
        default: { textAlign: 'left' },
      },
    },
    axisLine: {
      arrow: {
        end: {
          symbol: 'axis-arrow',
          size: 10,
        },
      },
    },
  },
});

canvas.appendChild(linear);

const poptip = new Poptip();

poptip.bind(linear, (e) => {
  let target = e.target;

  if (target?.name !== 'label') target = false;
  // 判断展示的文本是否缺省
  if (!target?.style?.text.endsWith('...')) target = false;
  return {
    //  获取原始文本
    html: e.target?.getConfig().style.text,
    target,
    position: 'top',
    follow: true,
    offset: [0, -10],
  };
});
