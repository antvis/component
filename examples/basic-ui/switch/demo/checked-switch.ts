import { Canvas } from '@antv/g';
import { Switch, Button } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 200,
  renderer,
});

const checkedSwitch = new Switch({
  style: {
    x: 50,
    y: 50,
    defaultChecked: false,
  },
});

const button = new Button({
  style: {
    x: 100,
    y: 50,
    text: 'Simple Button',
    onClick: () => {
      button.flag = !button.flag;
      checkedSwitch.update({
        checked: button.flag,
      });
    },
  },
});
button.flag = true;
canvas.appendChild(button);
canvas.appendChild(checkedSwitch);
