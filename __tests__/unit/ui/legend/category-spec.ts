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
    // @ts-ignore
    expect(category.getItem('chrome')!.markerShape.attr('symbol')).toBe('diamond');
    // @ts-ignore
    expect(category.getItem('IE')!.markerShape.attr('symbol')).toBe('circle');
    // @ts-ignore
    expect(category.getItem('QQ')!.markerShape.attr('symbol')).toBe('triangle');

    // state
    expect(category.getItem('chrome')!.getState()).toBe('selected');

    // color
    // @ts-ignore
    expect(category.getItem('chrome')!.nameShape.attr('fill')).toBe('white');
    // @ts-ignore
    expect(category.getItem('IE')!.nameShape.attr('fill')).toBe('gray');

    // G bug， getElementsByName 找不到background
    // @ts-ignore
    expect(category.getItem('chrome')!.backgroundShape!.attr('fill')).toBe('#dea739');
    // @ts-ignore
    expect(category.getItem('IE')!.backgroundShape!.attr('fill')).toBe('#fdf6e3');
  });

  test('horizontal wrap', async () => {
    category.update({
      title: {
        content: '横向分页',
      },
      spacing: [10, 10],
      maxWidth: 200,
      maxItemWidth: 160,
    });
    const IE = category.getItem('IE')!;
    const QQ = category.getItem('QQ')!;
    const { width: IEWidth } = getShapeSpace(IE);
    // QQ 位于第二页第二项
    expect(QQ.attr('x')).toBeCloseTo(200 + IEWidth + 10);
  });

  // test('vertical', async () => {
  //   category.update({
  //     title: {
  //       content: '纵向',
  //     },
  //     orient: 'vertical',
  //     maxWidth: undefined,
  //     maxItemWidth: undefined,
  //     itemWidth: 140,
  //   });

  //   expect(category.getItem('chrome').attr('x')).toBe(0);
  //   expect(category.getItem('IE').attr('x')).toBe(0);
  //   expect(category.getItem('QQ').attr('x')).toBe(0);
  // });

  // test('vertical wrap', async () => {
  //   category.update({
  //     title: {
  //       content: '分列',
  //     },
  //     spacing: [10, 10],
  //     maxHeight: 100,
  //     itemWidth: 160,
  //   });

  //   const Chrome = category.getItem('chrome');
  //   const Firefox = category.getItem('Firefox');
  //   expect(Firefox.attr('x')).toBe(Chrome.attr('x') + 10 + 160);
  // });

  // test('states', async () => {
  //   category.update({
  //     reverse: false,
  //     items: [
  //       { name: 'Chrome', value: '7.08%', state: 'default', id: 'chrome' },
  //       { name: 'IE', value: '5.41%', state: 'active', id: 'IE' },
  //       { name: 'QQ', value: '5.35%', state: 'selected', id: 'QQ' },
  //       { name: 'Firefox', value: '1.23%', id: 'Firefox' },
  //       { name: 'Microsoft Edge', value: '3.51%' },
  //       { name: '360', value: '2.59%' },
  //       { name: 'Opera', value: '0.87%' },
  //       { name: 'Sogou', value: '1.06%' },
  //       { name: 'Others', value: '0.59%' },
  //     ],
  //   });

  //   expect(category.getItem('chrome').getState()).toBe('default');
  //   expect(category.getItem('IE').getState()).toBe('active');
  //   expect(category.getItem('QQ').getState()).toBe('selected');
  //   expect(category.getItem('Firefox').getState()).toBe('default');
  // });
});

// category.destroy();
// canvas.destroy();
