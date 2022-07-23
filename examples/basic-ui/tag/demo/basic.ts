import { Canvas, Line } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tag } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 400,
  height: 400,
  renderer,
});

canvas.appendChild(new Line({ style: { x1: 10, y1: 10, x2: 310, y2: 10, lineWidth: 1, stroke: '#d9d9d9' } }));
canvas.appendChild(new Line({ style: { x1: 10, y1: 160, x2: 310, y2: 160, lineWidth: 1, stroke: '#d9d9d9' } }));
canvas.appendChild(new Line({ style: { x1: 10, y1: 10, x2: 10, y2: 310, lineWidth: 1, stroke: '#d9d9d9' } }));
canvas.appendChild(new Line({ style: { x1: 160, y1: 10, x2: 160, y2: 310, lineWidth: 1, stroke: '#d9d9d9' } }));
canvas.appendChild(new Line({ style: { x1: 310, y1: 10, x2: 310, y2: 310, lineWidth: 1, stroke: '#d9d9d9' } }));
canvas.appendChild(new Line({ style: { x1: 10, y1: 310, x2: 310, y2: 310, lineWidth: 1, stroke: '#d9d9d9' } }));

canvas.appendChild(
  new Tag({
    style: {
      x: 10,
      y: 10,
      text: 'Tag 1',
      padding: [4, 7],
    },
  })
);
canvas.appendChild(
  new Tag({
    style: {
      x: 310,
      y: 160,
      text: 'End Middle',
      padding: [4, 7],
      align: 'end',
      verticalAlign: 'middle',
    },
  })
);
canvas.appendChild(
  new Tag({
    style: {
      x: 160,
      y: 160,
      text: 'Center Bottom',
      padding: [4, 7],
      align: 'center',
      verticalAlign: 'bottom',
    },
  })
);

const linkTag = new Tag({
  style: {
    x: 10,
    y: 160,
    text: 'Link Tag',
    padding: [4, 7],
  },
});
canvas.appendChild(linkTag);
// 监听事件
linkTag.on('mouseenter', () => {
  linkTag.update({ cursor: 'pointer ' });
});
linkTag.on('mouseleave', () => {
  linkTag.update({ cursor: 'default ' });
});
linkTag.on('click', () => {
  window.open('httsp://github.com/antvis/gui');
});
