import { Canvas } from '@antv/g';
import { Switch, Marker } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

Marker.registerSymbol('check', (x, y, r) => {
  return [
    ['M', x, y - r],
    ['A', r, r, 0, 0, 1, x, y + r],
    ['A', r, r, 0, 0, 1, x, y - r],
    ['Z'],
    ['M', x - r / 2, y + r / 8],
    ['L', x - r / 8, y + r / 2],
    ['L', x + r / 3, y - r / 2],
  ];
});

Marker.registerSymbol('stop', (x, y, r) => {
  return [
    ['M', x, y - r],
    ['A', r, r, 0, 0, 1, x, y + r],
    ['A', r, r, 0, 0, 1, x, y - r],
    ['Z'],
    ['M', x - r / 2, y],
    ['L', x + r / 2, y],
  ];
});

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 100,
  renderer,
});

const childrenSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
    checkedChildren: {
      text: '开启 √',
      marker: {
        symbol: 'check',
        stroke: '#fff',
        size: 12,
      },
    },
    unCheckedChildren: {
      text: '关闭 ×',
      marker: {
        symbol: 'stop',
        stroke: '#fff',
        size: 12,
      },
    },
  },
});

canvas.appendChild(childrenSwitch);
