import { Canvas } from '@antv/g-canvas';
import CategroyLegend from '../../../src/legend/category';
import { wait } from '../../../src/util/util';

describe('legend animate', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'clc';
  const canvas = new Canvas({
    container: 'clc',
    width: 500,
    height: 500,
  });

  const originItems = [
    { name: 'a', value: 1, marker: { symbol: 'circle', r: 4, stroke: 'red' } },
    { name: 'b', value: 2, marker: { symbol: 'square', r: 4, fill: 'red' } },
    { name: 'c', value: 3, marker: { symbol: 'circle', r: 4, stroke: 'blue' } },
    { name: 'd', value: 4, marker: { symbol: 'circle', r: 4, stroke: 'yellow' } },
  ];

  const container = canvas.addGroup();
  const legend = new CategroyLegend({
    id: 'c',
    container,
    x: 100,
    y: 100,
    items: originItems,
    updateAutoRender: true,
    itemBackground: null,
    animate: true,
    animateOption: {
      appear: {
        duration: 500,
        easing: 'easeQuadInOut',
      }, // 初始入场动画配置
      update: {
        duration: 450,
        easing: 'easeQuadInOut',
      }, // 更新时发生变更的动画配置
      enter: {
        duration: 400,
        easing: 'easeQuadInOut',
        delay: 100,
      }, // 更新时新增元素的入场动画配置
      leave: {
        duration: 350,
        easing: 'easeQuadIn',
      }, // 更新时销毁动画配置
    },
  });
  it('init', async () => {
    legend.render();
    const item1 = legend.getElementById('c-legend-item-group');
    expect(item1.attr('opacity')).toBe(0);
    await wait(550);
    expect(item1.attr('opacity')).toBe(1);
  });

  it('update', async () => {
    const items = [
      { name: 'a', value: 1, marker: { symbol: 'circle', r: 4, stroke: 'blue' } },
      { name: '1', value: 1.1, marker: { symbol: 'circle', r: 4, stroke: 'red' } },
      { name: '2', value: 1.1, marker: { symbol: 'circle', r: 4, stroke: 'red' } },
      { name: 'b', value: 2, marker: { symbol: 'square', r: 4, fill: 'red' } },
      { name: 'd', value: 4, marker: { symbol: 'circle', r: 4, stroke: 'yellow' } },
    ];
    const group = legend.getElementById('c-legend-item-group');
    const itemb = legend.getElementById('c-legend-item-b');
    const bbox = itemb.getCanvasBBox();
    legend.update({
      items,
    });
    const bbox1 = itemb.getCanvasBBox();
    expect(bbox1.x).toBe(bbox.x);
    expect(group.getCount()).toBe(items.length + 1);
    await wait(550);
    const bbox2 = itemb.getCanvasBBox();
    expect(bbox2.x).not.toBe(bbox.x);
    expect(group.getCount()).toBe(items.length);
  });

  it('reverse', async () => {
    const items = legend.getItems();
    items.reverse();
    const itema = legend.getElementById('c-legend-item-a');
    const itemd = legend.getElementById('c-legend-item-d');
    legend.update({
      items,
    });
    expect(itema.getCanvasBBox().x).toBeLessThan(itemd.getCanvasBBox().x);
    await wait(550);
    expect(itema.getCanvasBBox().x).toBeGreaterThan(itemd.getCanvasBBox().x);
  });
  afterAll(() => {
    legend.destroy();
  });
});
