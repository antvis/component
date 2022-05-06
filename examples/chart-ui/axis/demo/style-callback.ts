import { Canvas, Rect, Group } from '@antv/g';
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

rect.appendChild(
  new LinearAxis({
    style: {
      startPos: [10, 40],
      endPos: [410, 40],
      ticks: [
        { value: 0.02, text: 'ABC', id: '0' },
        { value: 0.18, text: 'BCED', id: '1' },
        { value: 0.34, text: 'DEFGH', id: '2' },
        { value: 0.5, text: 'GHIJKM', id: '3' },
        { value: 0.66, text: 'KMLNOPQ', id: '4' },
        { value: 0.8200000000000001, text: 'PQRSTVVW', id: '5' },
        { value: 0.98, text: 'VWXYZ', id: '6' },
      ],
      label: {
        autoEllipsis: true,
        margin: [0, 2],
        autoHide: true,
        autoHideTickLine: false,
        style: (datum, idx) => {
          return {
            fill: 'black',
            fillOpacity: 0.65,
            fontSize: 12,
            dx: idx === 0 ? -4 : idx === 6 ? 4 : 0,
            textAlign: idx === 0 ? 'start' : idx === 6 ? 'end' : 'center',
          };
        },
      },
    },
  })
);
