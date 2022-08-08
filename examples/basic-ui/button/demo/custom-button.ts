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
    text: 'Custom Button',
    type: 'primary',
    marker: (x, y, size) => {
      const r = size * 2;
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
    padding: 4,
    markerSpacing: 2,
    // ellipsis: true,
    buttonStyle: {
      default: {
        radius: 5,
        stroke: '#000',
      },
      active: {
        stroke: '#eb913a',
        fill: '#fff',
      },
    },
    textStyle: {
      default: {
        fill: '#fff',
      },
      active: {
        fill: '#eb913a',
      },
    },
    markerStyle: {
      default: {
        fill: '#fff',
        size: 12,
      },
      active: {
        fill: '#eb913a',
        size: 12,
      },
    },
  },
});

canvas.appendChild(button);
