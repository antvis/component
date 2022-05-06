import { Canvas, Rect, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '@antv/gui';
import { Band as BandScale } from '@antv/scale';

const renderer = new CanvasRenderer();

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
          rotate: 0,
          maxLength: 80,
          minLength: 20,
          autoHide: false,
          autoEllipsis: true,
          alignTick: true,
          autoHideTickLine: false,
          margin: [0, 0, 0, 2],
        },
      },
    })
  );
}

const data5 = ['2020-12-28', '2020-12-29', '2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02'];
const data6 = ['2020-12-27', ...data5];
const data7 = ['2020-12-26', ...data6];

// [todo] 优化日期轴标签展示
createAxis([50, 100], [400, 100], data5, 'time');
// 日期优化展示
createAxis([50, 230], [400, 230], data6, 'time');
// 日期优化展示，始终展示最后一个标签（全称）
createAxis([50, 360], [400, 360], data7, 'time');
