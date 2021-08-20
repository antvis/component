import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '@antv/gui';

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

const button = new Button({
  style: {
    x: 50,
    y: 40,
    text: 'Disabled',
    textStyle: {
      default: {
        fill: '#ce2c1e',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
      },
    },
    buttonStyle: {
      default: {
        fill: '#fcf1f0',
        opacity: 1,
        stroke: '#ce2c1e',
        lineWidth: 1,
        radius: 5,
      },
    },
    disabled: true,
  },
});

canvas.appendChild(button);
