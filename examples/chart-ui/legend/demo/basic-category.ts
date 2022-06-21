import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 400,
  renderer,
});

const items1 = [
  { name: '事例一', color: '#4982f8' },
  { name: '事例二', color: '#41d59c' },
  { name: '事例三', color: '#516587' },
  { name: '事例四', color: '#f9b41b' },
  { name: '事例五', color: '#624ef7' },
];

const items2 = [
  { name: '1991', color: '#4982f8' },
  { name: '1992', color: '#41d59c' },
  { name: '1993', color: '#516587' },
  { name: '1994', color: '#f9b41b' },
  { name: '1995', color: '#624ef7' },
];

const items3 = [
  { name: 'Tokyo', color: '#4982f8' },
  { name: 'London', color: '#41d59c' },
];

const items4 = [
  { name: 'series1', color: '#4982f8' },
  { name: 'series2', color: '#41d59c' },
];

function createCategory(x, y, items, symbol = 'circle', furtherOptions = {}) {
  const category = new Category({
    style: {
      x,
      y,
      title: { content: 'Legend title' },
      items,
      itemMarker: {
        size: 10,
        symbol,
        style: {
          active: { stroke: '#000', lineWidth: 1 },
        },
      },
      padding: [12, 0],
      spacing: [8, 0],
      maxItemWidth: 160,
      pageNavigator: {
        pageSpacing: 4,
      },
      ...furtherOptions,
    },
  });
  canvas.appendChild(category);

  // 外部处理事件监听和交互
  category.addEventListener('pointermove', (evt) => {
    const legendItem = evt.composedPath().find((d) => d.className === 'legend-item');
    if (!legendItem) return;
    legendItem.setState('active');
  });
  category.addEventListener('pointerout', (evt) => {
    const legendItem = evt.composedPath().find((d) => d.className === 'legend-item');
    if (!legendItem) return;
    legendItem.setState('default');
  });
}

createCategory(50, 10, items1, undefined, { maxWidth: 200 });
createCategory(50, 60, items2, 'square');
createCategory(50, 120, items3, undefined, {
  padding: [4, 8],
  title: { content: '带背景框' },
  backgroundStyle: {
    fill: 'rgba(255,0,0,0.05)',
    radius: 4,
  },
  itemMarker: {
    size: 12,
    symbol: 'smooth',
    style: {
      lineWidth: 1,
      fill: 'transparent',
    },
  },
});
createCategory(50, 180, items4, undefined, {
  itemMarker: {
    size: 10,
    symbol: 'hvh',
    style: {
      lineWidth: 1,
      fill: 'transparent',
    },
  },
});
