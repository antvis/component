import { Canvas, Rect, Line } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { deepMix } from '@antv/util';
import { Continuous } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

// 创建一个包围盒
const rect = new Rect({ style: { x: 20, y: 20, width: 540, height: 580, stroke: '#dfdfdf', lineWidth: 1 } });
const line1 = new Line({ style: { x1: 200, y1: 20, x2: 200, y2: 580, stroke: '#dfdfdf', lineWidth: 1 } });
const line2 = new Line({ style: { x1: 360, y1: 20, x2: 360, y2: 580, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);
canvas.appendChild(line1);
canvas.appendChild(line2);

function createContinuousLegend(options = {}) {
  const continuous = new Continuous({
    style: deepMix(
      {
        label: {
          align: 'rail',
        },
        rail: {
          width: 100,
          height: 16,
        },
        handle: false,
        min: 100,
        max: 1100,
        color: [
          '#d0e3fa',
          '#acc7f6',
          '#8daaf2',
          '#6d8eea',
          '#4d73cd',
          '#325bb1',
          '#5a3e75',
          '#8c3c79',
          '#e23455',
          '#e7655b',
        ],
      },
      options
    ),
  });
  rect.appendChild(continuous);
  return continuous;
}

createContinuousLegend({ title: { content: '基础' } });
createContinuousLegend({ y: 80, label: { spacing: 12 }, handle: {}, title: { content: '带手柄' } });
createContinuousLegend({ y: 160, label: { align: 'start', spacing: 2 }, title: { content: 'label 在上方' } });
createContinuousLegend({ y: 240, label: { align: 'end', spacing: 2 }, title: { content: 'label 在下方' } });
createContinuousLegend({
  y: 320,
  label: { align: 'end', spacing: 2, flush: false },
  rail: { ticks: [300, 500, 700, 900] },
  title: { content: '自定义滑轨 tick 标签' },
});

// 垂直
createContinuousLegend({
  x: 180,
  orient: 'vertical',
  label: { spacing: 2, style: { textAlign: 'left' }, offset: [-8] },
  rail: { width: 16, height: 80 },
});
createContinuousLegend({
  x: 180,
  y: 130,
  orient: 'vertical',
  label: { spacing: 2, align: 'end' },
  rail: { width: 16, height: 80 },
});
createContinuousLegend({
  x: 180,
  y: 260,
  orient: 'vertical',
  rail: { width: 16, height: 80 },
  label: { spacing: 2, align: 'start' },
  title: { content: 'label 在左侧', spacing: 4 },
});
createContinuousLegend({
  x: 180,
  y: 420,
  orient: 'vertical',
  rail: { width: 16, height: 80, ticks: [350, 600, 850] },
  label: { align: 'end', flush: false, spacing: 4 },
  title: { content: '自定义滑轨 tick 标签', spacing: 12 },
});

// 垂直带手柄
createContinuousLegend({
  x: 340,
  orient: 'vertical',
  rail: { width: 16, height: 80 },
  handle: {},
});

createContinuousLegend({
  x: 340,
  y: 130,
  orient: 'vertical',
  rail: { width: 16, height: 80 },
  handle: {},
  label: { align: 'start', spacing: 4 },
  title: { content: 'label 在左侧' },
});
createContinuousLegend({
  x: 340,
  y: 280,
  orient: 'vertical',
  rail: { width: 16, height: 80, chunked: true, ticks: [350, 600, 850] },
  handle: {},
  label: { spacing: 4 },
  title: { content: 'label 在左侧' },
});
createContinuousLegend({
  x: 340,
  y: 420,
  orient: 'vertical',
  rail: { width: 16, height: 80, chunked: true, ticks: [350, 600, 850] },
  label: { align: 'end', flush: false, spacing: 4 },
  title: { content: '自定义滑轨 tick 标签', spacing: 12 },
});
