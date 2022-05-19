import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 400,
  renderer,
});

const category = new Category({
  style: {
    x: 10,
    y: 10,
    title: { content: '基本分类图例' },
    items: [
      { name: 'Chrome', value: '7.08%' },
      { name: 'IE', value: '5.41%' },
      { name: 'QQ', value: '5.35%' },
      { name: 'Firefox', value: '1.23%' },
      { name: 'Microsoft Edge', value: '3.51%' },
      { name: '360', value: '2.59%' },
      { name: 'Opera', value: '0.87%' },
      { name: 'Sogou', value: '1.06%' },
      { name: 'Others', value: '0.59%' },
    ].map(({ name, value }) => {
      return { name, value, id: name, state: 'selected' };
    }),
    spacing: [10, 10],
    maxHeight: 40,
    maxWidth: 250,
  },
});
const rect = canvas.appendChild(
  new Rect({ style: { stroke: 'black', lineWidth: 1, x: 1, y: 200, width: 271, height: 200 } })
);
rect.appendChild(category);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel([category], '分页配置', {
  'pager.position': {
    label: '分页器位置',
    value: 'right',
    // options: ['top', 'bottom', 'left', 'right', 'top-bottom', 'left-right'],
    options: ['bottom', 'right'],
  },
  'pager.button.size': {
    label: '分页器按钮大小',
    value: 16,
    type: 'number',
    range: [10, 30],
  },
  'pager.button.style.default.fill': {
    label: '分页器按钮填充色',
    value: '#000',
    type: 'color',
  },
  'pager.button.style.disabled.fill': {
    label: '分页器按钮禁止态填充色',
    value: '#d9d9d9',
    type: 'color',
  },
  'pager.text.style.fill': {
    label: '分页器文本颜色',
    value: '#000',
    type: 'color',
  },
});
