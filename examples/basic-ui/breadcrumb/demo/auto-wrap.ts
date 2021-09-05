import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Breadcrumb } from '@antv/gui';
import * as dat from 'dat.gui';

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
    x: 0,
    y: 0,
    width: 120,
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

// 初始化控制器
const cfg = new dat.GUI({ autoPlace: false });
document.getElementById('container').appendChild(cfg.domElement);
const folder = cfg.addFolder('配置项');
folder.open();

const schema = [{ attribute: 'width', label: '宽度', range: [10, 300] }];
const scrollbarCfg = {};
schema.forEach((cfg) => {
  const value = breadcrumb.attributes[cfg.attribute];
  scrollbarCfg[cfg.label] = Array.isArray(value) ? value[0] : value;
});

schema.forEach((cfg) => {
  folder.add(scrollbarCfg, cfg.label, ...(cfg.range || [])).onChange((v) => {
    breadcrumb.update({ [cfg.attribute]: v });
  });
});
