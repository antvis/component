import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

function createScrollbar(x, y, trackStyle, thumbStyle, furtherOptions = {}) {
  canvas.appendChild(
    new Scrollbar({
      style: {
        x,
        y,
        orient: 'vertical',
        value: 0,
        width: 10,
        height: 200,
        thumbLen: 100,
        padding: 0,
        trackStyle: {
          default: trackStyle,
        },
        thumbStyle: {
          default: thumbStyle,
        },
        ...furtherOptions,
      },
    })
  );
}

createScrollbar(
  5,
  5,
  { lineWidth: 1, stroke: '#c0c0c0', shadowColor: '#c0c0c0', shadowBlur: 10, radius: 5 },
  { fill: '#c0c0c0' },
  { padding: 2 }
);

createScrollbar(
  20,
  5,
  { lineWidth: 1, stroke: '#c0c0c0', shadowColor: '#c0c0c0', shadowBlur: 10, radius: 5 },
  { fill: '#4a4a4a' }
);

createScrollbar(
  35,
  5,
  { lineWidth: 1, stroke: '#cecece', shadowColor: '#c0c0c0', shadowBlur: 10 },
  { fill: '#000' },
  { width: 5, isRound: false }
);

createScrollbar(
  50,
  5,
  { lineWidth: 1, stroke: '#cecece', shadowColor: '#c0c0c0', shadowBlur: 10, radius: 5 },
  { fill: 'l(45) 0:#143189 0.1#3a71b4 1:#92a6d0' }
);

createScrollbar(
  65,
  5,
  {
    lineWidth: 1,
    stroke: '#cecece',
    shadowColor: '#c0c0c0',
    shadowBlur: 10,
    radius: 5,
    fill: 'p(a)https://gw.alipayobjects.com/mdn/rms_ecd6f4/afts/img/A*P5t4QJH2rBEAAAAAAAAAAAAAARQnAQ',
  },
  { fill: 'p(a)https://gw.alipayobjects.com/mdn/rms_ecd6f4/afts/img/A*FlaDS6e5pL8AAAAAAAAAAAAAARQnAQ' }
);
