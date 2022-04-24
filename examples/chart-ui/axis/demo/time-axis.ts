import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '@antv/gui';
import { Band as BandScale } from '@antv/scale';

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

function createTickData(domain: string[]) {
  const scale = new BandScale({ domain, paddingOuter: 0.1 });
  return domain.map(
    (d, idx) => {
      return {
        value: scale.map(d) + scale.getBandWidth() / 2,
        text: d,
        id: String(idx),
      };
    },
    [[], 0]
  );
}

// 创建一个包围盒
const rect = new Rect({ style: { x: 20, y: 20, width: 460, height: 500, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

function createAxis(startPos, endPos, tickData, type, formatter = (item) => item.text) {
  rect.appendChild(
    new Linear({
      style: {
        startPos,
        endPos,
        ticks: createTickData(tickData),
        label: {
          type,
          formatter,
          rotation: 0,
          maxLength: 80,
          minLength: 20,
          autoHide: true,
          autoEllipsis: false,
          alignTick: true,
          autoHideTickLine: false,
        },
      },
    })
  );
}

const data5 = ['2020-12-28', '2020-12-29', '2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02'];
const data6 = ['2020-12-27', ...data5];
const data7 = ['2020-12-26', ...data6];

// [todo] 优化日期轴标签展示

createAxis([50, 50], [400, 50], data5, 'text');
createAxis([50, 100], [400, 100], data5, 'time');

createAxis([50, 180], [400, 180], data6, 'text');
// 日期优化展示
createAxis([50, 230], [400, 230], data6, 'time');

createAxis([50, 310], [400, 310], data7, 'text');
// 日期优化展示，始终展示最后一个标签（全称）
createAxis([50, 360], [400, 360], data7, 'time');
