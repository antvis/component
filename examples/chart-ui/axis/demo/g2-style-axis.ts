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

function createTickData(data, p1 = 0, p2 = 0) {
  return data.map((d, idx) => {
    const step = 1 / (data.length - p1);
    return {
      value: step * (idx + p2),
      text: d,
      state: 'default',
      id: String(idx),
    };
  });
}

function createAxis(startPos, endPos, tickData, label = {}, tickLine = {}, furtherOption = {}, param = []) {
  canvas.appendChild(
    new Linear({
      style: {
        startPos,
        endPos,
        ticks: createTickData(tickData, ...param),
        axisLine: {
          style: {
            stroke: '#cdcdcd',
          },
        },
        label: {
          rotate: 0,
          autoHide: false,
          autoEllipsis: true,
          offset: [0, 15],
          alignTick: true,
          style: {
            default: {
              fill: '#818181',
            },
          },
          ...label,
        },
        tickLine: {
          len: 5,
          style: { default: { stroke: '#cdcdcd' } },
          ...tickLine,
        },
        ...furtherOption,
      },
    })
  );
}

const data1 = ['2013', '2014', '2015', '2016', '2017'];
const data2 = ['2015-01-04', '2015-08-02', '2016-02-28', '2016-09-25', '2017-04-23', '2017-11-19', '2018-06-17'];
const data3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const data4 = ['1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999'];

createAxis([50, 50], [400, 50], data1, { alignTick: false }, { len: 0 }, {});
createAxis([50, 100], [600, 100], data2, {}, {}, {}, [1]);
createAxis([50, 150], [400, 150], data3, { alignTick: false }, { appendTick: true }, {}, [0]);
createAxis([50, 200], [400, 200], data4, {}, {}, {}, [-1, 1]);
