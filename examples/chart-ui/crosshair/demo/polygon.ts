import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { PolygonCrosshair } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const [cx, cy] = [250, 250];
const polygon = new PolygonCrosshair({
  style: {
    defaultRadius: 50,
    center: [cx, cy],
    sides: 8,
    lineStyle: {
      lineWidth: 1,
    },
  },
});
canvas.appendChild(polygon);

// canvas.addEventListener('mousemove', (e) => {
//   polygon.setPointer([e.offsetX, e.offsetY]);
// });

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const cfgFolder = cfg.addFolder('配置');
cfgFolder.open();

cfg
  .add({ sides: 8 }, 'sides', 3, 12)
  .step(1)
  .onChange((sides) => {
    polygon.update({ sides });
  });

cfg
  .add({ startAngle: 0 }, 'startAngle', 0, 360)
  .step(1)
  .onChange((startAngle) => {
    polygon.update({ startAngle });
  });

cfg
  .add({ defaultRadius: 50 }, 'defaultRadius', 0, 200)
  .step(5)
  .onChange((defaultRadius) => {
    polygon.update({ defaultRadius });
  });
