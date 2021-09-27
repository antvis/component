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

function createTickData(data) {
  return data.map((d, idx) => {
    const step = 1 / (data.length - 1);
    return {
      value: step * idx,
      text: String(d),
      state: 'default',
      id: String(idx),
    };
  });
}

function createAxis(startPos, endPos, tickData, type, formatter = (item) => item.text) {
  canvas.appendChild(
    new Linear({
      style: {
        startPos,
        endPos,
        ticks: createTickData(tickData),
        axisLine: {
          style: {
            stroke: '#cdcdcd',
          },
        },
        label: {
          type,
          formatter,
          rotate: 0,
          autoHide: false,
          maxLength: 100,
          minLength: 20,
          autoEllipsis: true,
          offset: [0, 15],
          alignTick: true,
          style: {
            default: {
              fill: '#818181',
            },
          },
        },
        tickLine: {
          len: 5,
          appendTick: true,
          style: { default: { stroke: '#cdcdcd' } },
        },
      },
    })
  );
}

const data0 = new Array(6).fill(0);
const data1 = new Array(6).fill(0).map((d, i) => i * 10);
const data2 = new Array(6).fill(0).map((d, i) => 10 ** i);
const data3 = new Array(7).fill(0).map((d, i) => 10 ** i);
const data4 = new Array(8).fill(0).map((d, i) => 10 ** i);

createAxis([50, 5], [400, 5], data0, 'number', (item, idx) => String(idx));
createAxis([50, 50], [400, 50], data1, 'number');
createAxis([50, 100], [400, 100], data2, 'number');
createAxis([50, 150], [400, 150], data3, 'number');
createAxis([50, 200], [400, 200], data4, 'number');

const data5 = ['2020-12-28', '2020-12-29', '2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02'];
const data6 = ['2020-12-27', ...data5];
const data7 = ['2020-12-26', ...data6];

createAxis([50, 250], [400, 250], data5, 'time');
createAxis([50, 300], [400, 300], data6, 'time');
createAxis([50, 350], [400, 350], data7, 'time');

const data8 = ['A', 'BC', 'DEF', 'GHIJ', 'KMLNO', 'PQRSTV', 'VWXYZA'];
const data9 = ['ABC', 'BCED', 'DEFGH', 'GHIJKM', 'KMLNOPQ', 'PQRSTVVW', 'VWXYZABC'];
const data10 = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
createAxis([50, 400], [400, 400], data8, 'text');
createAxis([50, 450], [400, 450], data9, 'text');
createAxis([50, 500], [400, 500], data10, 'text', (item) => new Array(10).fill(item.text).join(''));
