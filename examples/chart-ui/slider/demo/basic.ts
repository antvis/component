import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 500,
  renderer,
});
// 创建一个包围盒
const rect = new Rect({ style: { x: 20, y: 20, width: 460, height: 500, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

const horizontalSlider = new Slider({
  style: {
    x: 50,
    y: 10,
    width: 400,
    height: 20,
    values: [0.3, 0.7],
    names: ['2020-08-25', '2020-09-12'],
  },
});

const verticalSlider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 20,
    height: 400,
    orient: 'vertical',
    values: [0.3, 0.7],
    names: ['2020-08-25', '2020-09-12'],
  },
});

rect.appendChild(horizontalSlider);
rect.appendChild(verticalSlider);
