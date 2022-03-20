import { Canvas, Rect, Circle } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 500,
  renderer,
});

const rect = new Rect({
  style: {
    x: 60,
    y: 40,
    width: 220,
    height: 110,
    fill: 'red',
  },
});

const rect2 = new Rect({
  style: {
    x: 60,
    y: 180,
    width: 220,
    height: 110,
    fill: 'red',
  },
});

const circle = new Circle({
  style: {
    x: 120,
    y: 340,
    r: 25,
    fill: 'red',
  },
});

canvas.appendChild(rect);
canvas.appendChild(rect2);
canvas.appendChild(circle);

const createPoptip = (target, position, arrowPointAtCenter, follow) => {
  const poptip = new Poptip({
    style: {
      // 每个方向的 poptip 使用不同 id 辨识
      id: `gui-${position}-poptip`,
      position,
      text: position,
      // top left right bottom 方向定点
      arrowPointAtCenter,
      // 是否跟随鼠标
      follow,
    },
  });

  poptip.bind(target);
};

const positions = [
  'top',
  'top-left',
  'top-right',
  'right',
  'right-top',
  'right-bottom',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'left-top',
  'left-bottom',
];
// 固定 12 个方向展示
positions.forEach((position) => {
  createPoptip(rect, position, true, false);
});

const positions2 = ['top', 'right', 'bottom', 'left'];

// 跟随平移展示
positions2.forEach((position) => {
  createPoptip(rect2, position, false, false);
});

// 跟随平移展示
positions2.forEach((position) => {
  createPoptip(rect2, position, false, false);
});

createPoptip(circle, 'top', false, true);

const observer = new MutationObserver(() => {
  const poptips = document.getElementsByClassName('gui-poptip');
  Array.from(poptips).forEach((poptip) => {
    if (poptip.id !== 'gui-poptip') poptip.remove();
  });
});
const container = document.getElementById('container');
observer.observe(container, { childList: true });
