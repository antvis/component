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
  { name: 'Chrome', value: '7.08%', color: '#5B8FF9' },
  { name: 'IE', value: '5.41%', color: '#61DDAA' },
  { name: 'QQ', value: '5.35%', color: '#65789B' },
  { name: 'Firefox', value: '1.23%', color: '#F6BD16' },
  { name: 'Microsoft Edge', value: '3.51%', color: '#7262fd' },
  { name: '360', value: '2.59%' },
  { name: 'Opera', value: '0.87%' },
  { name: 'Sogou', value: '1.06%' },
  { name: 'Others', value: '0.59%' },
];
const category = new Category({
  style: {
    x: 10,
    y: 20,
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
        active: {
          stroke: '#000',
          lineWidth: 1,
        },
        unselected: {
          fillOpacity: 0.35,
        },
      },
    },
  },
});

canvas.appendChild(category);

const itemsState = {};
/** valueChanged */
category.addEventListener('pointerdown', (event) => {
  const target = event.composedPath().find((d) => d.className === 'legend-item');
  if (target) {
    if (target.getState().includes('unselected')) {
      target.setState('unselected', false);
    } else {
      target.setState('unselected', true);
    }
  }
});
/** valueChanged */
let activeLegendItem;
category.addEventListener('pointermove', (event) => {
  const target = event.composedPath().find((d) => d.className === 'legend-item');
  if (activeLegendItem && activeLegendItem !== target) {
    activeLegendItem.setState('active', false);
    activeLegendItem = null;
  } else if (target) {
    if (!target.getState().includes('unselected')) {
      target.setState('active', true);
      activeLegendItem = target;
    }
  }
});
category.addEventListener('pointerleave', (event) => {
  if (activeLegendItem) {
    activeLegendItem.setState('active', false);
    activeLegendItem = null;
  }
});
