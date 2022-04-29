import { Canvas } from '@antv/g';
import { Switch, Marker } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 200,
  height: 200,
  renderer,
});

const defaultSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
  },
});

const smallSwitch = new Switch({
  style: {
    x: 50,
    y: 80,
    size: 'small',
  },
});

const miniSwitch = new Switch({
  style: {
    x: 50,
    y: 100,
    size: 'mini',
  },
});

canvas.appendChild(defaultSwitch);
canvas.appendChild(smallSwitch);
canvas.appendChild(miniSwitch);

const defaultSwitch2 = new Switch({
  style: {
    x: 120,
    y: 50,
    checkedChildren: { text: '开启' },
    unCheckedChildren: { text: '关闭' },
  },
});

const smallSwitch2 = new Switch({
  style: {
    x: 120,
    y: 80,
    size: 'small',
    checkedChildren: { text: '开启' },
    unCheckedChildren: { text: '关闭' },
  },
});

Marker.registerSymbol('check', (x, y, r) => {
  return [
    ['M', x - r / 2, y + r / 8],
    ['L', x - r / 8, y + r / 2],
    ['L', x + r / 3, y - r / 2],
  ];
});

Marker.registerSymbol('uncheck', (x, y, r) => {
  return [
    ['M', x - r / 2, y - r / 2],
    ['L', x + r / 2, y + r / 2],
    ['M', x + r / 2, y - r / 2],
    ['L', x - r / 2, y + r / 2],
  ];
});

const miniSwitch2 = new Switch({
  style: {
    x: 120,
    y: 100,
    size: 'mini',
    checkedChildren: { marker: { symbol: 'check', stroke: '#fff' } },
    unCheckedChildren: { marker: { symbol: 'uncheck', stroke: '#fff' } },
  },
});

canvas.appendChild(defaultSwitch2);
canvas.appendChild(smallSwitch2);
canvas.appendChild(miniSwitch2);
