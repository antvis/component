import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '../../../../src/ui/legend';
import { createDiv } from '../../../utils';
import { getShapeSpace } from '../../../../src/util';

const style = {
  itemMarker: (item: any, idx: number) => {
    return {
      marker: ['diamond', 'circle', 'triangle'][idx % 3],
      size: 8,
      style: {
        default: {
          fill: idx % 2 === 0 ? '#ecbf41' : '#d94948',
        },
      },
    };
  },
  itemName: {
    style: {
      default: {
        fontSize: 14,
      },
    },
  },
  itemValue: {
    style: {
      default: {
        fontSize: 14,
      },
    },
  },
};

const items = [
  { name: 'Chrome', value: '7.08%', id: 'chrome', state: 'selected' as 'selected' },
  { name: 'IE', value: '5.41%', id: 'IE' },
  { name: 'QQ', value: '5.35%', id: 'QQ' },
  { name: 'Firefox', value: '1.23%', id: 'Firefox' },
  { name: 'Microsoft Edge', value: '3.51%' },
  { name: '360', value: '2.59%' },
  { name: 'Opera', value: '0.87%' },
  { name: 'Sogou', value: '1.06%' },
  { name: 'Others', value: '0.59%' },
];

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const div = createDiv();
const canvas = new Canvas({
  container: div,
  width: 1000,
  height: 300,
  renderer,
});

const category = new Category({
  style: {
    x: 10,
    y: 10,
    items,
    title: {
      content: '横向',
    },
    spacing: [10, 10],
    maxItemWidth: 160,
    ...style,
  },
});
canvas.appendChild(category);

describe('category', () => {
  test('horizontal', async () => {
    // shape
    expect(category.getItem('chrome').getElementsByName('marker')[0].attr('symbol')).toBe('diamond');
    expect(category.getItem('IE').getElementsByName('marker')[0].attr('symbol')).toBe('circle');
    expect(category.getItem('QQ').getElementsByName('marker')[0].attr('symbol')).toBe('triangle');

    // state
    expect(category.getItem('chrome').getState()).toBe('selected');

    // color
    expect(category.getItem('chrome').getElementsByName('name')[0].attr('fill')).toBe('white');
    expect(category.getItem('IE').getElementsByName('name')[0].attr('fill')).toBe('gray');

    // G bug， getElementsByName 找不到background
    expect(category.getItem('chrome').firstChild!.attr('fill')).toBe('#dea739');
    expect(category.getItem('IE').firstChild!.attr('fill')).toBe('#fdf6e3');
  });

  test('horizontal wrap', async () => {
    category.update({
      title: {
        content: '分行',
      },
      spacing: [10, 10],
      maxWidth: 200,
      maxItemWidth: 160,
    });
    const Chrome = category.getItem('chrome');
    const QQ = category.getItem('QQ');
    const { height } = getShapeSpace(Chrome);

    expect(QQ.attr('y')).toBeCloseTo(Chrome.attr('y') + height + 10, -1);
  });

  test('vertical', async () => {
    category.update({
      title: {
        content: '纵向',
      },
      orient: 'vertical',
      maxWidth: undefined,
      maxItemWidth: undefined,
      itemWidth: 140,
    });

    expect(category.getItem('chrome').attr('x')).toBe(0);
    expect(category.getItem('IE').attr('x')).toBe(0);
    expect(category.getItem('QQ').attr('x')).toBe(0);
  });

  test('vertical wrap', async () => {
    category.update({
      title: {
        content: '分列',
      },
      spacing: [10, 10],
      maxHeight: 100,
      itemWidth: 160,
    });

    const Chrome = category.getItem('chrome');
    const Firefox = category.getItem('Firefox');
    expect(Firefox.attr('x')).toBe(Chrome.attr('x') + 10 + 160);
  });

  test('states', async () => {
    category.update({
      reverse: false,
      items: [
        { name: 'Chrome', value: '7.08%', state: 'default', id: 'chrome' },
        { name: 'IE', value: '5.41%', state: 'active', id: 'IE' },
        { name: 'QQ', value: '5.35%', state: 'selected', id: 'QQ' },
        { name: 'Firefox', value: '1.23%', id: 'Firefox' },
        { name: 'Microsoft Edge', value: '3.51%' },
        { name: '360', value: '2.59%' },
        { name: 'Opera', value: '0.87%' },
        { name: 'Sogou', value: '1.06%' },
        { name: 'Others', value: '0.59%' },
      ],
    });

    expect(category.getItem('chrome').getState()).toBe('default');
    expect(category.getItem('IE').getState()).toBe('active');
    expect(category.getItem('QQ').getState()).toBe('selected');
    expect(category.getItem('Firefox').getState()).toBe('default');
  });
});

// category.destroy();
// canvas.destroy();
