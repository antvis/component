import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Sparkline } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

function random(min, max) {
  var range = max - min;
  var rand = Math.random();
  return min + Math.floor(rand * range);
}

const canvas = new Canvas({
  container: 'container',
  width: 500,
  height: 300,
  renderer,
});

const sparkline = new Sparkline({
  style: {
    x: 10,
    y: 10,
    width: 500,
    height: 40,
    smooth: true,
    areaStyle: {
      lineWidth: 0,
      opacity: 0.5,
    },
    data: [Array.from({ length: 100 }, (v, i) => random(0, 100))],
  },
});

canvas.appendChild(sparkline);
