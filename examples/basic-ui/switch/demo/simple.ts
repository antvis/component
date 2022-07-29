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

const simpleSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
    checkedChildren: {
      text: '开启',
    },
    unCheckedChildren: {
      text: '关闭',
    },
  },
});

let checked = true;
canvas.appendChild(simpleSwitch);
simpleSwitch.on('click', (e) => {
  checked = !checked;
  simpleSwitch.update({
    checked,
  });
});
