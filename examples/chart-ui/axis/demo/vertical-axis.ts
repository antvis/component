import { Canvas, Rect } from '@antv/g';
import { deepMix } from '@antv/util';
import { Linear as LinearScale } from '@antv/scale';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear as LinearAxis } from '@antv/gui';

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
const rect = new Rect({ style: { x: 20, y: 20, width: 460, height: 500, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

const linearScale = new LinearScale({ domain: [0, 479], range: [0, 1], tickCount: 10, nice: true });
const ticks = linearScale.getTicks().map((d, idx) => {
  return {
    value: linearScale.map(d),
    text: String(d),
    id: String(idx),
  };
});
function createAxis(startPos = [0, 0], endPos = [0, 0], options = {}) {
  const axis = new LinearAxis({
    style: deepMix({ startPos, endPos, title: { content: 'Quantitative Axis' }, ticks }, options),
  });
  rect.appendChild(axis);

  return axis;
}

// 创建纵坐标，由下至上
createAxis([100, 200], [100, 60], { verticalFactor: -1 });
createAxis([180, 60], [180, 200], { verticalFactor: -1, title: { titleAnchor: 'start', offset: -4 } });
createAxis([260, 200], [260, 60], { verticalFactor: -1, title: { titleAnchor: 'start', offset: -4 } });
createAxis([400, 200], [400, 60], {
  verticalFactor: -1,
  title: { titleAnchor: 'start', rotation: 0, positionX: 0, offset: -8 },
});

createAxis([60, 260], [60, 400], {});
createAxis([140, 400], [140, 260], { title: { titleAnchor: 'start', offset: -4 } });
createAxis([220, 260], [220, 400], { title: { titleAnchor: 'start', offset: -4 } });

// 设置 rotation 为 0 -> override `x` position by specified `positionX` -> add `offset` distance between axisTitle and axisLine.
createAxis([360, 400], [360, 260], { title: { titleAnchor: 'start', rotation: 0, positionX: 0, offset: -8 } });
