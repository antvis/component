import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const items = [
  { name: 'Chrome', value: '7.08%', state: 'selected', color: '#5B8FF9' },
  { name: 'IE', value: '5.41%', state: 'selected', color: '#61DDAA' },
  { name: 'QQ', value: '5.35%', state: 'selected', color: '#65789B' },
  { name: 'Firefox', value: '1.23%', color: '#F6BD16' },
  { name: 'Microsoft Edge', value: '3.51%', color: '#7262fd' },
  { name: '360', value: '2.59%' },
  { name: 'Opera', value: '0.87%' },
  { name: 'Sogou', value: '1.06%' },
  { name: 'Others', value: '0.59%' },
].map(({ name, value }) => {
  return { name, value, id: name, state: 'selected' };
});

const category = new Category({
  style: {
    x: 10,
    y: 10,
    items,
    title: {
      content: '基本分类图例',
    },
    spacing: [10, 10],
    maxWidth: 440,
    autoWrap: true,
    maxRows: 4,
    cols: 3,
    itemMarker: {
      style: {
        fill: '#6bce85',
      },
    },
  },
});

canvas.appendChild(category);
