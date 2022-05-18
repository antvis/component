import { Canvas, Circle, Text } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 140,
  renderer,
});

const circle = new Circle({
  style: {
    cx: 180,
    cy: 50,
    r: 25,
    fill: 'red',
  },
});

const text = new Text({
  style: {
    x: 300,
    y: 50,
    fontFamily: 'PingFang SC',
    text: 'G.Text...',
    fontSize: 20,
    textBaseline: 'top',
    stroke: '#F04864',
    lineWidth: 5,
  },
});

canvas.appendChild(circle);
canvas.appendChild(text);

// G.Rect
const poptip = new Poptip({
  style: {
    containerClassName: 'custom-poptip-domStyles',
    domStyles: {
      '.custom-poptip-domStyles': {
        'border-radius': '8px',
      },
    },
    text: '隐藏信息',
  },
});

poptip.bind(circle, { follow: true, offset: [0, -8] });
poptip.bind(text, {
  arrowPointAtCenter: true,
});
