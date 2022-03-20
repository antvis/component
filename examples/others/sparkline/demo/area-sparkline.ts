import { Canvas, Rect, Text } from '@antv/g';
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
  height: 500,
  renderer,
});

function createSparkline(title, x, y, data, options = {}) {
  const text = new Text({ style: { x, y, text: title, fontSize: 12, textBaseline: 'top' } });
  const sparkline = new Sparkline({
    style: {
      x: 0,
      y: 0,
      width: 500,
      height: 30,
      smooth: true,
      isStack: true,
      areaStyle: {
        lineWidth: 0,
        opacity: 0.5,
      },
      data,
      ...options,
    },
  });
  const rect = new Rect({ style: { x, y: y + 16, width: 500, height: 30, stroke: '#dfdfdf', lineWidth: 1 } });
  canvas.appendChild(text);
  canvas.appendChild(rect);

  rect.appendChild(sparkline);
}

createSparkline(
  'Normal',
  0,
  0,
  Array.from({ length: 100 }, (v, i) => random(10, 50))
);
createSparkline(
  'config minValue',
  0,
  60,
  Array.from({ length: 100 }, (v, i) => random(10, 50)),
  { minValue: 0 }
);

const data2 = Array.from({ length: 100 }, (v, i) => random(-46, -10));
createSparkline('All negative values', 0, 120, data2);
createSparkline('config nice to "false"', 0, 180, data2, { nice: false });

const data3 = Array.from({ length: 100 }, (v, i) => random(-20, 20));
createSparkline('Positive and negative values exist', 0, 240, data3, { minValue: 0 });
createSparkline('', 0, 280, data3);
createSparkline('', 0, 320, data3, { maxValue: 0 });

createSparkline('Stacked sparkline', 0, 380, [
  Array.from({ length: 100 }, (v, i) => random(20, 50)),
  Array.from({ length: 100 }, (v, i) => random(50, 100)),
]);
