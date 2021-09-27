import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const createContinuous = (x, y, railType, orient, chunked, title) => {
  const shape =
    orient === 'horizontal'
      ? {
          width: 300,
          height: 30,
        }
      : {
          width: 30,
          height: 300,
        };
  canvas.appendChild(
    new Continuous({
      style: {
        x,
        y,
        title: {
          content: title,
        },
        orient,
        label: false,
        rail: {
          chunked,
          type: railType,
          ticks: [10, 20, 30, 40, 50, 60, 70, 80, 90],
          ...shape,
        },
        handle: false,
        min: 0,
        max: 100,
        color: [
          '#d0e3fa',
          '#acc7f6',
          '#8daaf2',
          '#6d8eea',
          '#4d73cd',
          '#325bb1',
          '#5a3e75',
          '#8c3c79',
          '#e23455',
          '#e7655b',
        ],
      },
    })
  );
};

createContinuous(0, 0, 'color', 'horizontal', false, 'color');
createContinuous(300, 0, 'color', 'horizontal', true, 'color-chunked');

createContinuous(0, 100, 'size', 'horizontal', false, 'size');
createContinuous(300, 100, 'size', 'horizontal', true, 'size-chunked');

createContinuous(0, 200, 'color', 'vertical', false, '\ncolor\nvertical');
createContinuous(100, 200, 'color', 'vertical', true, 'color\nvertical\nchunked');

createContinuous(200, 200, 'size', 'vertical', false, '\nsize\nvertical');
createContinuous(300, 200, 'size', 'vertical', true, 'size\nvertical\nchunked');
