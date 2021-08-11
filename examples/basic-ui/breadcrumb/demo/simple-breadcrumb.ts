import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { BreadCrumb } from '@antv/gui';

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

const breadcrumb = new BreadCrumb({
  style: {
    x: 50,
    y: 50,
    items: [{ name: '测试1' }, { name: '测试2' }, { name: '测试3' }, { name: '测试4' }, { name: '测试5' }],
    onClick: (...args) => console.log(args),
  },
});

canvas.appendChild(breadcrumb);
