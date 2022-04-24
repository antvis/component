import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { deepMix } from '@antv/util';
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
      id: String(idx),
    };
  });
}

function createAxis(startPos, endPos, tickData, type, options?) {
  canvas.appendChild(
    new Linear({
      style: deepMix(
        {
          startPos,
          endPos,
          ticks: createTickData(tickData),
          label: {
            type,
            rotation: 0,
            autoHide: false,
            maxLength: 100,
            minLength: 20,
            autoEllipsis: true,
            alignTick: true,
          },
        },
        options
      ),
    })
  );
}

const data0 = new Array(6).fill(0);
const data1 = new Array(6).fill(0).map((d, i) => i * 10);
const data2 = new Array(6).fill(0).map((d, i) => 10 ** i);
const data3 = new Array(7).fill(0).map((d, i) => 10 ** i);
const data4 = new Array(8).fill(0).map((d, i) => 10 ** i);

createAxis([50, 5], [400, 5], data0, 'number', { label: { formatter: (item, idx) => String(idx) } });
createAxis([50, 50], [400, 50], data1, 'number');
createAxis([50, 100], [400, 100], data2, 'number');
createAxis([50, 150], [400, 150], data3, 'number');
createAxis([50, 200], [400, 200], data4, 'number');

const data8 = ['A', 'BC', 'DEF', 'GHIJ', 'KMLNO', 'PQRSTV', 'VWXYZA'];
const data9 = ['ABC', 'BCED', 'DEFGH', 'GHIJKM', 'KMLNOPQ', 'PQRSTVVW', 'VWXYZABC'];
const data10 = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
createAxis([50, 300], [400, 300], data8, 'text', {
  label: {
    autoHide: true,
    style: (datum, idx) => {
      const font = { fontSize: 12 };
      if (idx === 0) return { ...font, textAlign: 'start' };
      if (idx === data8.length - 1) return { ...font, textAlign: 'end' };
      return font;
    },
  },
});
createAxis([50, 350], [400, 350], data9, 'text');
createAxis([50, 400], [400, 400], data10, 'text', (item) => new Array(10).fill(item.text).join(''));
