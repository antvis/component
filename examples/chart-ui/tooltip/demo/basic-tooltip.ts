import { Canvas, Rect, Circle } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tooltip } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

/* create dots */
new Array(10 ** 2).fill(Math.random() * 100).forEach((val, idx) => {
  canvas.appendChild(
    new Circle({
      name: 'dot',
      style: {
        x: ((idx % 10) + 1.5) * 50,
        y: (Math.floor(idx / 10) + 1.5) * 50,
        r: 10,
        fill: `rgb(${Array.from({ length: 3 }, () => {
          return Math.round((0.4 + Math.random() * 0.6) * 255);
        }).join(',')})`,
        zIndex: 2,
      },
    })
  );
});

/* 边界区域 */
canvas.appendChild(
  new Rect({
    style: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
      fill: 'l(0) 0:#c97f7f 0.1:#cb8a87 0.2:#cd968f 0.3:#cfa197 0.4:#d1ac9f 0.5:#d3b8a6 0.6:#d5c3ae 0.7:#d7ceb6 0.8:#d9dabe 0.9:#dbe5c6',
    },
  })
);

const tooltip = new Tooltip({
  style: {
    title: 'Color',
    x: 0,
    y: 0,
    offset: [20, 20],
    position: 'bottom-right',
    items: [],
    bounding: {
      x: 50,
      y: 50,
      width: 500,
      height: 500,
    },
    visibility: 'hidden',
  },
});

// 移除其他 tooltip
Array.from(document.getElementsByClassName('tooltip')).forEach((tooltip) => tooltip.remove());
// 添加tooltip
document.body.appendChild(tooltip.HTMLTooltipElement);

let colorList = [];
// 绑定tooltip事件
canvas.addEventListener('mousemove', (e) => {
  if (e.target && e.target.name === 'dot') {
    tooltip.show();
    const fill = e.target.attr('fill');
    fill !== colorList[0] && colorList.unshift(fill);
    colorList = colorList.slice(0, 5);
    tooltip.update({
      x: e.offsetX,
      y: e.offsetY,
      items: colorList.map((color, idx) => ({ color, name: `${idx + 1}`, value: `${color}`, fill: color })),
    });
  } else {
    tooltip.hide();
  }
});

// 更新边界信息
const { left, top } = document.getElementById('container').getBoundingClientRect();
tooltip.update({
  container: {
    x: left,
    y: top,
  },
});
