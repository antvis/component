import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const items = [
  { name: 'Chrome', value: '7.08%', id: 'chrome', state: 'selected', color: '#5B8FF9' },
  { name: 'IE', value: '5.41%', id: 'IE', state: 'selected', color: '#61DDAA' },
  { name: 'QQ', value: '5.35%', id: 'QQ', state: 'selected', color: '#65789B' },
  { name: 'Firefox', value: '1.23%', id: 'Firefox', color: '#F6BD16' },
  { name: 'Microsoft Edge', value: '3.51%', color: '#7262fd' },
  { name: '360', value: '2.59%' },
  { name: 'Opera', value: '0.87%' },
  { name: 'Sogou', value: '1.06%' },
  { name: 'Others', value: '0.59%' },
];

const category = new Category({
  style: {
    pager: {
      button: {
        position: 'right',
      },
    },
    x: 10,
    y: 10,
    items,
    title: {
      content: '基本分类图例',
    },
    spacing: [10, 10],
    maxWidth: 350,
    maxItemWidth: 180,
    autoWrap: true,
    itemMarker: ({ color }) => {
      return {
        style: {
          fill: color || '#ecbf41',
        },
      };
    },
    itemName: {
      style: {
        fill: '#d94948',
      },
    },
    itemValue: {
      style: {
        fill: '#1cb4a2',
      },
    },
  },
});

canvas.appendChild(category);
