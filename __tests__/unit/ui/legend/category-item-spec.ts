import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { CategoryItem } from '../../../../src/ui/legend/categoryItem';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

const div = createDiv();
const canvas = new Canvas({
  container: div,
  width: 1000,
  height: 300,
  renderer,
});

const categoryItem = new CategoryItem({
  style: {
    x: 0,
    y: 0,
    state: 'default',
    id: '1',
    itemWidth: 100,
    maxItemWidth: 200,
    itemMarker: {
      size: 8,
      symbol: 'circle',
      style: {
        default: {
          fill: 'red',
        },
        selected: {
          fill: 'green',
        },
        active: {
          opacity: 0.9,
          fill: 'green',
        },
      },
    },
    itemName: {
      style: {
        default: {
          fontSize: 12,
          opacity: 1,
          fill: 'red',
          textBaseline: 'middle',
        },
        selected: {
          fontSize: 12,
          opacity: 1,
          fill: 'green',
        },
        active: {
          fontSize: 12,
          opacity: 0.9,
          fill: 'green',
        },
      },
      spacing: 5,
      content: 'name',
    },
    itemValue: {
      style: {
        default: {
          fontSize: 12,
          opacity: 1,
          fill: 'red',
          textBaseline: 'middle',
        },
        selected: {
          fontSize: 12,
          opacity: 1,
          fill: 'green',
        },
        active: {
          fontSize: 12,
          opacity: 0.9,
          fill: 'green',
        },
      },
      spacing: 5,
      content: 'value',
    },
    backgroundStyle: {
      default: {
        fill: 'rgba(245, 0, 31, 0.1)',
      },
      selected: {
        fill: 'rgba(255, 192, 50, 0.1)',
      },
      active: {
        fill: 'rgba(67, 195, 119, 0.1)',
      },
    },
  },
});

canvas.appendChild(categoryItem);

describe('category-item', () => {
  test('default', () => {
    // @ts-ignore
    expect(categoryItem.markerShape.attr('fill')).toBe('red');
    // @ts-ignore
    expect(categoryItem.markerShape.attr('size')).toBe(8);
    // @ts-ignore
    expect(categoryItem.nameShape.attr('fill')).toBe('red');
    // @ts-ignore
    expect(categoryItem.valueShape.attr('fill')).toBe('red');
    // @ts-ignore
    expect(categoryItem.background.attr('fill')).toBe('rgba(245, 0, 31, 0.1)');
  });
  test('selected', () => {
    categoryItem.setState('selected');
    // @ts-ignore
    expect(categoryItem.markerShape.attr('fill')).toBe('green');
    // @ts-ignore
    expect(categoryItem.nameShape.attr('fill')).toBe('green');
    // @ts-ignore
    expect(categoryItem.valueShape.attr('fill')).toBe('green');
    // @ts-ignore
    expect(categoryItem.background.attr('fill')).toBe('rgba(255, 192, 50, 0.1)');
  });
  test('active', () => {
    categoryItem.setState('active');
    // @ts-ignore
    expect(categoryItem.markerShape.attr('fill')).toBe('green');
    // @ts-ignore
    expect(categoryItem.markerShape.attr('opacity')).toBe(0.9);
    // @ts-ignore
    expect(categoryItem.nameShape.attr('fill')).toBe('green');
    // @ts-ignore
    expect(categoryItem.nameShape.attr('opacity')).toBe(0.9);
    // @ts-ignore
    expect(categoryItem.nameShape.attr('fill')).toBe('green');
    // @ts-ignore
    expect(categoryItem.nameShape.attr('opacity')).toBe(0.9);
    // @ts-ignore
    expect(categoryItem.background.attr('fill')).toBe('rgba(67, 195, 119, 0.1)');
  });
});
