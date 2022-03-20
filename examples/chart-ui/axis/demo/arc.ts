import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Arc } from '@antv/gui';
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

const arc = new Arc({
  style: {
    startAngle: -90,
    endAngle: 270,
    radius: 150,
    center: [200, 200],
    verticalFactor: -1,
    title: {
      content: '圆弧坐标轴',
      rotate: 0,
      position: 'center',
      offset: [0, -140],
    },
    ticks: new Array(60).fill(0).map((tick, idx) => {
      const step = 1 / 60;
      return {
        value: idx * step,
        text: String(idx),
      };
    }),
    label: {
      offset: [0, 14],
      autoHideTickLine: false,
    },
    tickLine: {
      len: 6,
      style: {
        default: {
          lineWidth: 1,
        },
      },
    },
    subTickLine: {
      count: 1,
      len: 4,
      style: {
        default: {
          stroke: 'red',
          lineWidth: 1,
        },
      },
    },
  },
});

canvas.appendChild(arc);

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const arcFolder = cfg.addFolder('配置项');
arcFolder.open();
const arcCfg = {
  x: 200,
  y: 200,
  起始角: -90,
  终止角: 270,
  半径: 150,
  标签对齐: 'normal',
  轴线正方向: 'inner',
};
const x = arcFolder.add(arcCfg, 'x', 0, 300).onChange((x) => {
  arc.update({ center: [x, y.getValue()] });
});
const y = arcFolder.add(arcCfg, 'y', 0, 300).onChange((y) => {
  arc.update({ center: [x.getValue(), y] });
});
arcFolder.add(arcCfg, '起始角', -90, 180).onChange((startAngle) => {
  arc.update({ startAngle });
});
arcFolder.add(arcCfg, '终止角', -0, 270).onChange((endAngle) => {
  arc.update({ endAngle });
});
arcFolder.add(arcCfg, '半径', 50, 200).onChange((radius) => {
  arc.update({ radius });
});
arcFolder.add(arcCfg, '标签对齐', ['normal', 'tangential', 'radial']).onChange((align) => {
  arc.update({ label: { align } });
});
arcFolder.add(arcCfg, '轴线正方向', ['inner', 'outer']).onChange((dir) => {
  arc.update({ verticalFactor: dir === 'inner' ? -1 : 1 });
});
