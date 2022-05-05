import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Toolbox } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const toolbox = new Toolbox({
  style: {
    features: ['reset', 'reload', 'download'],
    onClick: (name) => {
      // do something
    },
  },
});

canvas.appendChild(toolbox);
