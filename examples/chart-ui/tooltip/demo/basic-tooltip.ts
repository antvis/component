import { throttle, pick } from '@antv/util';
import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip } from '@antv/gui';

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

/* 创建背景 */
canvas.appendChild(
  new Rect({
    style: {
      x: 0,
      y: 0,
      height: 600,
      width: 600,
      lineWidth: 1,
      fill: '#ddd',
      stroke: 'black',
    },
  })
);

/* 边界区域 */
canvas.appendChild(
  new Rect({
    style: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
      fill: 'lightgreen',
    },
  })
);

const tooltip = new Tooltip({
  style: {
    title: '标题',
    x: 0,
    y: 0,
    offset: [20, 20],
    position: 'bottom-right',
    items: [
      {
        value: 1000,
        name: '第一项',
        index: 0,
        color: '#83c6e8',
      },
      {
        value: 2000,
        name: '第二项',
        index: 1,
        color: '#616f8f',
      },
    ],
    parent: document.getElementById('container').firstChild,
    bounding: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
    },
  },
});

// 移除之前的tooltip
Array.from(document.getElementsByClassName('tooltip')).forEach((tooltip) => tooltip.remove());
// 添加tooltip
document.body.appendChild(tooltip.HTMLTooltipElement);
// 使用throttle函数，防止tooltip的移动速度过快
const mousemove = throttle(
  (e) => {
    tooltip.position = [e.offsetX, e.offsetY];
  },
  100,
  {}
);
// 绑定tooltip事件
canvas.addEventListener('mousemove', (e) => {
  mousemove(e);
});
canvas.addEventListener('mouseenter', () => {
  tooltip.show();
});
canvas.addEventListener('mouseleave', () => {
  tooltip.hide();
});

// 3秒后更新tooltip
setTimeout(() => {
  tooltip.update({
    title: '更新了标题',
    items: [
      {
        value: '1,000',
        name: '第三项',
        index: 0,
        color: '#678ef2',
      },
      {
        value: '4,000',
        name: '第四项',
        index: 1,
        color: '#7dd5a9',
      },
      {
        value: '2,000',
        name: '第五项',
        index: 1,
        color: '#edbf45',
      },
    ],
  });
}, 3000);
