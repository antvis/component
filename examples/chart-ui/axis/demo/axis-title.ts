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

function createData(domain, tickCount = 10, { x1, y1, x2, y2 }) {
  const linearScale = new LinearScale({ domain, range: [0, 1], tickCount, nice: true });
  const ticks = linearScale.getTicks().map((d, idx) => {
    return { value: linearScale.map(d), text: String(d), id: String(idx) };
  });

  const points = (x1, y1, x2, y2) => [
    [x1, y1],
    [x2, y2],
  ];
  const gridItems = linearScale.getTicks().map((d, idx) => {
    const y = y1 + (y2 - y1) * linearScale.map(d);
    return { points: points(x1, y, x2, y) };
  });

  return { ticks, gridItems };
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
      options
    ),
  });
  rect.appendChild(axis);

  return axis;
}

const axis1 = createAxis([100, 324], [100, 164], {
  verticalFactor: -1,
  ticks: createData([0, 700000000], 7, { x1: 100, y1: 164, x2: 300, y2: 324 }).ticks,
  title: {
    content: 'Axis title',
    titlePadding: 2,
    style: {
      fontSize: 12,
      textBaseline: 'bottom',
    },
  },
  label: {
    // maxLength: 36,
    formatter: (tick) => {
      return `${Number(tick.text) / 10 ** 8} 亿`;
    },
  },
});

const { ticks: axis2Ticks, gridItems: axis2Items } = createData([0, 8000000], 8, {
  x1: 100,
  x2: 300,
  y1: 556,
  y2: 406,
});
const axis2 = createAxis([100, 556], [100, 406], {
  verticalFactor: -1,
  ticks: axis2Ticks,
  grid: {
    items: axis2Items,
    alternateColor: '#efefef',
  },
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
  },
  label: {
    maxLength: 54,
    formatter: (tick) => {
      return `${Number(tick.text) / 1000}K`;
    },
  },
});
createAxis([240, 356], [240, 206], {
  verticalFactor: -1,
  ticks: createData([0, 7000000], 7, { x1: 240, y1: 206, x2: 440, y2: 256 }).ticks,
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
