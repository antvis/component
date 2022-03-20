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

function createAxis(startPos = [0, 0], endPos = [0, 0], options = {}) {
  const axis = new LinearAxis({
    style: deepMix(
      {
        // @ts-ignore
        startPos,
        // @ts-ignore
        endPos,
        title: {
          content: '数值',
        },
        label: {
          offset: [0, -4],
        },
      },
      options
    ),
  });
  rect.appendChild(axis);

  return axis;
}

const linearScale = new LinearScale({ domain: [0, 479], range: [0, 1], tickCount: 10, nice: true });
const data = linearScale.getTicks().map((d, idx) => {
  return {
    value: linearScale.map(d),
    text: String(d),
    state: 'default',
    id: String(idx),
  };
});

// 创建纵坐标，由下至上
createAxis([100, 200], [100, 60], {
  ticks: data,
  title: {
    offset: [-4, -16],
    // 设置 axisTitle 位置
    position: 'end',
    rotate: 0,
  },
  label: {
    style: {
      default: {
        textAlign: 'right',
      },
    },
  },
});

createAxis([160, 200], [160, 60], {
  ticks: data,
  verticalFactor: -1,
  title: {
    // todo 应该支持自动计算，否则需要外部去判断 axis tickLabel 的长度情况
    offset: [38, 0],
    rotate: 90,
  },
  label: {
    offset: [0, -4],
    style: {
      default: {
        textAlign: 'left',
      },
    },
  },
});
