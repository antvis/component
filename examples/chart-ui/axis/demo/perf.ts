import { Canvas, Group } from '@antv/g';
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

const count = 5000;
const tickData = Array(count)
  .fill(null)
  .map((_, idx) => {
    const step = 1 / count;
    const c = Math.floor(idx / 26) + 1;
    const b = idx % 26;
    return {
      value: step * idx + step / 2,
      text: Array(Math.min(c, 5))
        .fill(String.fromCharCode(b + 65))
        .join(''),
      id: String(idx),
    };
  });

const axis = new Linear({
  style: {
    container: canvas.appendChild(new Group()),
    startPos: [0, 300],
    endPos: [600, 300],
    ticks: tickData,
    title: {
      content: 'Axis Title',
    },
    ticksThreshold: 100,
    label: {
      minLength: 20,
      maxLength: 80,
      autoRotate: false,
      autoHide: true,
      // autoHide: 'greedy',
      autoEllipsis: false,
      optionalAngles: [20, 30, 45],
      style: {
        textAlign: 'start',
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
    subTickLine: false,
  },
});

canvas.appendChild(axis);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel(axis, '样式', {
  'label.style.fontSize': { label: '标签字号', value: 10, type: 'number', step: 1, range: [5, 30] },
  'label.style.textAlign': { label: '标签对齐方式', value: 'left', options: ['start', 'center', 'end'] },
  'label.autoEllipsis': { label: '自动省略', value: false },
  'label.minLength': { label: '最小缩略长度', value: 20, type: 'number', step: 5, range: [20, 200] },
  'label.maxLength': { label: '标签最大长度', value: 160, type: 'number', step: 5, range: [20, 200] },
  'label.autoRotate': { label: '自动旋转', value: false },
  'label.autoHide': { label: '自动隐藏', value: true },
});
// const labelMin = labelFolder
//   .add(labelCfg, '最少标签数量', 1, 5)
//   .step(1)
//   .onChange((minLabel) => {
//     axis.update({ label: getDefaultLabelCfg({ minLabel }) });
//   });
