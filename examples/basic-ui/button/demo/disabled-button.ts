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
    y: 40,
    text: 'hoverStyle',
    hoverStyle: {
      textStyle: {
        fill: '#abc',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
      },
      buttonStyle: {
        fill: 'pink',
        opacity: 0.5,
        stroke: '#666',
        lineWidth: 5,
        radius: 10,
        lineDash: [6, 10],
      },
    },
    disabled: true,
  },
});

canvas.appendChild(button);
