import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Breadcrumb } from '@antv/gui';

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

const breadcrumb = new Breadcrumb({
  style: {
    x: 50,
    y: 50,
    items: [
      { text: 'AntV', id: '1' },
      { text: 'GUI', id: '2' },
      { text: 'Breadcrumb', id: '3' },
    ],
    seperator: {
      text: '>',
    },
    onClick: (id, item, items) => console.log('id: %s, item: %o, items: %o', id, item, items),
  },
});

canvas.appendChild(breadcrumb);
