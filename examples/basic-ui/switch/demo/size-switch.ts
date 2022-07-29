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
