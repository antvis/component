import { Canvas } from '@antv/g';
import { Switch } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 100,
  renderer,
});

// 开启颜色
const OPTION_COLOR = '#1890FF';
// 关闭颜色
const CLOSE_COLOR = '#00000040';

const simpleSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
    style: {
      default: {
        stroke: CLOSE_COLOR,
        fill: CLOSE_COLOR,
      },
      selected: {
        stroke: OPTION_COLOR,
        fill: OPTION_COLOR,
      },
    },
  },
});

canvas.appendChild(simpleSwitch);
