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
  canvas.appendChild(
    new Category({
      style: {
        x,
        y,
        title: { content: 'Legend title' },
        items,
        itemMarker: {
          size: 10,
          symbol,
        },
        padding: [12, 0],
        spacing: [8, 0],
        maxItemWidth: 160,
        pageNavigator: {
          pageSpacing: 4,
        },
        ...furtherOptions,
      },
    })
  );
}

createCategory(50, 10, items1, undefined, { maxWidth: 200 });
createCategory(50, 60, items2, 'square');
createCategory(50, 110, items3, undefined, {
  itemMarker: {
    size: 12,
    symbol: 'smooth',
    style: {
      lineWidth: 1,
      fill: 'transparent',
    },
  },
});
createCategory(50, 160, items4, undefined, {
  itemMarker: {
    size: 10,
    symbol: 'hvh',
    style: {
      lineWidth: 1,
      fill: 'transparent',
    },
  },
});
