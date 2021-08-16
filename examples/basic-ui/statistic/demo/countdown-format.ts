import { Canvas } from '@antv/g';
import { Countdown } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 500,
  height: 300,
  renderer,
});

const countdown = new Countdown({
  style: {
    x: 0,
    y: 0,
    title: {
      text: '距离双十一还有:',
    },
    value: {
      timestamp: new Date(`${new Date().getFullYear()}-11-11 00:00:00`),
      format: 'D 天 HH 小时 mm 分钟 ss 秒 SSS 毫秒',
    },
  },
});

canvas.appendChild(countdown);
