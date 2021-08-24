import { Canvas } from '@antv/g';
import { Switch } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 200,
  height: 200,
  renderer,
});

const bigSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
    size: 28,
  },
});

const defaultSwitch = new Switch({
  style: {
    x: 50,
    y: 90,
  },
});

const smallSwitch = new Switch({
  style: {
    x: 50,
    y: 120,
    size: 14,
  },
});

canvas.appendChild(defaultSwitch);
canvas.appendChild(smallSwitch);
canvas.appendChild(bigSwitch);
