import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Breadcrumb } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const breadcrumb = new Breadcrumb({
  style: {
    x: 0,
    y: 0,
    items: [
      { text: '测试1', id: '1' },
      { text: '测试2', id: '2' },
      { text: '测试3', id: '3' },
      { text: '测试4', id: '4' },
      { text: '测试5', id: '5' },
    ],
    onClick: (id, item, items) => console.log('id: %s, item: %o, items: %o', id, item, items),
  },
});

canvas.appendChild(breadcrumb);
