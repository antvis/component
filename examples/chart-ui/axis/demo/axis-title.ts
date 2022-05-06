import { Canvas, Group, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { deepMix } from '@antv/util';
import { Linear as LinearScale } from '@antv/scale';
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

// 创建一个包围盒
const rect = new Rect({ style: { x: 0, y: 0, width: 460, height: 600, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

function createTicks(domain, tickCount = 10) {
  const linearScale = new LinearScale({ domain, range: [0, 1], tickCount, nice: true });
  return linearScale.getTicks().map((d, idx) => {
    return { value: linearScale.map(d), text: String(d), id: String(idx) };
  });
}

function createAxis(startPos = [0, 0], endPos = [0, 0], options = {}) {
  const axis = new Linear({
    style: deepMix(
      {
        startPos,
        endPos,
        title: { content: 'Quantitative Axis' },
        axisLine: { arrow: { start: { symbol: 'axis-arrow', size: 8 } } },
      },
      {
        ticks: createTicks([0, 480]),
        ...options,
      }
    ),
  });
  rect.appendChild(axis);

  return axis;
}

const axis1 = createAxis([60, 174], [60, 24], {
  verticalFactor: -1,
  ticks: createTicks([0, 700000000], 7),
  title: {
    content: 'Axis title',
    titlePadding: 2,
    style: {
      fontSize: 12,
      textAlign: 'center',
      textBaseline: 'bottom',
    },
    // limit x1 >= 14
    bounds: { x1: 14 },
  },
  label: {
    // maxLength: 36,
    formatter: (tick) => {
      return `${Number(tick.text) / 10 ** 8} 亿`;
    },
  },
});

const axis2 = createAxis([60, 390], [60, 220], {
  verticalFactor: -1,
  ticks: createTicks([0, 7000000], 7),
  title: {
    content: 'Axis title',
    titleAnchor: 'start',
    rotate: 0,
    // TitlePadding not work, because positionX,positionY could overwrite position.
    positionX: 0,
    positionY: -14,
    style: {
      textAlign: 'right',
    },
    // limit bounds
    bounds: { x1: 4, x2: 60 },
  },
  label: {
    maxLength: 54,
    formatter: (tick) => {
      return `${Number(tick.text) / 1000}K`;
    },
  },
});
createAxis([60, 586], [60, 436], {
  verticalFactor: -1,
  ticks: createTicks([0, 7000000], 7),
  title: {
    titleAnchor: 'start',
    rotate: 0,
    positionX: -60,
    style: {
      textAlign: 'left',
      dy: -14,
    },
  },
  label: {
    maxLength: 54,
    formatter: (tick) => {
      return `${Number(tick.text) / 1000}K`;
    },
  },
});

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel([axis1, axis2], 'Limit title in bounds', {
  'title.titlePadding': {
    label: '标题与标签偏移',
    type: 'number',
    value: 2,
    step: 1,
    range: [-20, 20],
  },
  'title.content': {
    label: '标题文本',
    value: 'Axis title',
    options: ['Axis title', 'Quantitative Axis long'],
  },
});
