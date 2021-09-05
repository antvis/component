import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Marker } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

Marker.registerSymbol('star', (x, y, r) => {
  const size = r * 2;
  const path = [];
  for (let i = 0; i < 5; i++) {
    path.push([
      i === 0 ? 'M' : 'L',
      (Math.cos(((18 + i * 72) * Math.PI) / 180) * size) / 2 + x,
      (-Math.sin(((18 + i * 72) * Math.PI) / 180) * size) / 2 + y,
    ]);
    path.push([
      'L',
      (Math.cos(((54 + i * 72) * Math.PI) / 180) * size) / 4 + x,
      (-Math.sin(((54 + i * 72) * Math.PI) / 180) * size) / 4 + y,
    ]);
  }
  path.push(['Z']);
  return path;
});

const star = new Marker({
  style: {
    symbol: 'star',
    x: 50,
    y: 50,
    size: 16,
    fill: 'orange',
  },
});
canvas.appendChild(star);

const triangle = new Marker({
  style: {
    symbol: 'triangle',
    x: 80,
    y: 50,
    size: 16,
    fill: 'green',
  },
});
canvas.appendChild(triangle);
