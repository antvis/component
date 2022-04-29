import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button, Marker } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const button = new Button({
  style: {
    x: 50,
    y: 50,
    text: '',
    type: 'primary',
    height: 40,
    width: 40,
    marker: (x, y, r) => {
      const path = [];
      for (let i = 0; i < 5; i++) {
        path.push([
          i === 0 ? 'M' : 'L',
          (Math.cos(((18 + i * 72) * Math.PI) / 180) * r) / 2 + x,
          (-Math.sin(((18 + i * 72) * Math.PI) / 180) * r) / 2 + y,
        ]);
        path.push([
          'L',
          (Math.cos(((54 + i * 72) * Math.PI) / 180) * r) / 4 + x,
          (-Math.sin(((54 + i * 72) * Math.PI) / 180) * r) / 4 + y,
        ]);
      }
      path.push(['Z']);
      return path;
    },
    padding: 0,
    markerSpacing: 0,
    // ellipsis: true,
    buttonStyle: {
      default: {
        radius: 20,
        stroke: '#000',
      },
      active: {
        stroke: '#c0365a',
        fill: '#fff',
      },
    },
    textStyle: {
      default: {
        fill: '#fff',
      },
      active: {
        fill: '#c0365a',
      },
    },
    markerStyle: {
      default: {
        fill: '#fff',
        size: 50,
      },
      active: {
        fill: '#c0365a',
        size: 50,
      },
    },
  },
});

canvas.appendChild(button);
