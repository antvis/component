import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const button = new Button({
  attrs: {
    x: 50,
    y: 50,
    text: 'Custom Button',
    type: 'primary',
    size: 'large',
    ellipsis: true,
    buttonStyle: {
      width: 130,
      lineDash: [10, 5],
      lineWidth: 2,
      radius: 10,
      stroke: '#000',
    },
    hoverStyle: {
      textStyle: {
        fill: '#000',
      },
      buttonStyle: {
        fill: 'red',
      },
    },
  },
});

canvas.appendChild(button);
