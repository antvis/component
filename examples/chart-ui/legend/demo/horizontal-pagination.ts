import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
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
    maxWidth: 210,
    orient: 'vertical',
  },
});
const rect = canvas.appendChild(
  new Rect({ style: { stroke: 'black', lineWidth: 1, x: 1, y: 200, width: 271, height: 200 } })
);
rect.appendChild(category);

/** -------------------------配置区域--------------------------------------- */
window.ConfigPanel([category], '分页配置', {
  orient: {
    label: '布局方式',
    value: 'horizontal',
    options: ['horizontal', 'vertical'],
  },
  autoWrap: {
    label: '自动换行',
    value: false,
  },
  maxRows: {
    label: '最大行数(横向布局且开启 autoWrap 生效)',
    value: 2,
    type: 'number',
    step: 1,
    range: [1, 5],
  },
  maxCols: {
    label: '最大行数(纵向布局且开启 autoWrap 生效)',
    value: 2,
    type: 'number',
    step: 1,
    range: [1, 5],
  },
  'pageNavigator.button.position': {
    label: '分页器位置',
    value: 'right',
    options: ['top', 'bottom', 'left', 'right', 'top-bottom', 'left-right'],
  },
});
