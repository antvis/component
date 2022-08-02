import { Canvas } from '@antv/g';
import { Checkbox } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const checkbox = new Checkbox({
  style: {
    x: 50,
    y: 50,
    label: {
      text: '单选框',
    },
  },
});

canvas.appendChild(checkbox);

// 自定义交互
let checked = false;
checkbox.on('click', (e) => {
  if (e.target.className.includes('checkbox-box')) {
    checked = !checked;
    checkbox.update({
      checked,
    });
  }
});

checkbox.on('mousemove', (e) => {
  if (e.target.className.includes('checkbox-box')) {
    checkbox.update({
      boxStyle: {
        stroke: '#3471F9',
      },
    });
  }
});

checkbox.on('mouseleave', (e) => {
  if (!checked) {
    checkbox.update({
      boxStyle: {
        stroke: '#dadada',
      },
    });
  }
});
