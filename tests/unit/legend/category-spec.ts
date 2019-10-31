import { Canvas } from '@antv/g-canvas';
import CategroyLegend from '../../../src/legend/category';

describe('test category legend', () => {
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
  describe('test horizontal legend', () => {
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'c',
      container,
      x: 100,
      y: 100,
      items: originItems,
    });

    it('init', () => {
      expect(legend.get('name')).toBe('legend');
      expect(legend.get('type')).toBe('category');
      expect(legend.get('layout')).toBe('horizontal');
    });

    it('render', () => {
      legend.render();
      expect(legend.get('group').attr('matrix')).toEqual([1, 0, 0, 0, 1, 0, 100, 100, 1]);
      const itemGroup = legend.getElementById('c-legend-item-group');
      expect(itemGroup).not.toBe(undefined);
      expect(itemGroup.getChildren().length).toBe(legend.get('items').length);
      const item1 = legend.getElementById('c-legend-item-a');
      expect(item1.getChildren().length).toBe(2);
      const bbox = item1.getBBox();
      expect(bbox.minX).toBe(0);
      expect(item1.getChildren()[0].get('type')).toBe('marker');
    });

    it('title', () => {
      expect(legend.getElementById('c-legend-title')).toBe(undefined);
      legend.update({
        title: {
          text: 'custom',
        },
      });
      expect(legend.getElementById('c-legend-title').attr('text')).toBe('custom');
      legend.update({
        title: null,
      });
      expect(legend.getElementById('c-legend-title')).toBe(undefined);
    });

    it('items', () => {
      const items = [
        { name: 'a', value: 1, marker: { symbol: 'circle', r: 4, stroke: 'red' } },
        { name: '1', value: 2, marker: { symbol: 'square', r: 4, fill: 'red' } },
        { name: '2', value: 3, marker: { symbol: 'circle', r: 4, stroke: 'blue' } },
        { name: 'd', value: 4, marker: { symbol: 'circle', r: 4, stroke: 'yellow' } },
        { name: '5', value: 5, marker: { symbol: 'circle', r: 4, stroke: 'pink' } },
      ];
      legend.update({
        items,
      });
      const itemGroup = legend.getElementById('c-legend-item-group');
      expect(itemGroup.getChildren().length).toBe(legend.get('items').length);
      expect(itemGroup.getChildren()[1].get('id')).toBe('c-legend-item-1');

      legend.update({
        items: [],
      });
      expect(itemGroup.getChildren().length).toBe(0);
    });

    it('items without marker', () => {
      const items = [{ name: '1' }, { name: '2' }, { name: '3' }];
      legend.update({
        items,
        marker: null,
      });
      const itemGroup = legend.getElementById('c-legend-item-group');
      expect(itemGroup.getChildren().length).toBe(3);
      expect(legend.getElementById('c-legend-item-1').get('children').length).toBe(1);
    });

    it('name & value', () => {
      const items = [
        { name: 'a', value: 1, marker: { symbol: 'circle', r: 4, stroke: 'red' } },
        { name: '1', value: 2, marker: { symbol: 'square', r: 4, fill: 'red' } },
        { name: '2', value: 3, marker: { symbol: 'circle', r: 4, stroke: 'blue' } },
        { name: 'd', value: 4, marker: { symbol: 'circle', r: 4, stroke: 'yellow' } },
        { name: '5', value: 5, marker: { symbol: 'circle', r: 4, stroke: 'pink' } },
      ];
      legend.update({
        items,
        marker: {},
        itemValue: {
          formatter(value) {
            return value + '%';
          },
        },
      });
      const item1 = legend.getElementById('c-legend-item-a');
      expect(item1.getChildren().length).toBe(3);
      expect(item1.getChildren()[2].attr('text')).toBe('1%');
    });

    it('itemWidth', () => {
      legend.update({
        itemWidth: 100,
      });
      const itemGroup = legend.getElementById('c-legend-item-group');
      const item1 = itemGroup.getChildren()[0];
      const item2 = itemGroup.getChildren()[1];
      expect(item2.getCanvasBBox().minX - item1.getCanvasBBox().minX).toBe(
        legend.get('itemWidth') + legend.get('itemSpacing')
      );
    });

    it('value align right', () => {
      const itemGroup = legend.getElementById('c-legend-item-group');
      const item1 = itemGroup.getChildren()[0];

      legend.update({
        itemWidth: 100,
        itemValue: {
          alignRight: true,
        },
      });
      expect(item1.getChildren()[2].attr('textAlign')).toBe('right');
    });

    it('max width auto wrap', () => {
      const marker = { symbol: 'circle', r: 4, stroke: 'red', fill: 'white' };
      legend.update({
        itemWidth: null,
        maxWidth: 300,
        itemValue: null,
        items: [
          { id: '1', name: '1111111111111111111', value: '1', marker },
          { id: '2', name: '22222222222', value: '2', marker },
          { id: '3', name: '3333333333333333333333', value: '3', marker },
          { id: '4', name: '444', value: '4', marker },
        ],
      });
      const itemGroup = legend.getElementById('c-legend-item-group');
      const item1 = itemGroup.getChildren()[0];
      const item2 = itemGroup.getChildren()[1];
      expect(item1.getCanvasBBox().minY).toBe(item2.getCanvasBBox().minY);
      legend.update({
        maxWidth: 120,
      });
      expect(item1.getCanvasBBox().minY).not.toBe(item2.getCanvasBBox().minY);
    });

    xit('max height', () => {});

    it('clear', () => {
      legend.clear();
      expect(legend.getElementById('c-legend-item-group')).toBe(undefined);
    });

    it('rerender', () => {
      legend.render();
      expect(legend.getElementById('c-legend-item-group')).not.toBe(undefined);
    });

    it('x, y, offsetX, offsetY', () => {
      legend.update({
        title: {
          text: '图例名',
        },
      });
      legend.setLocation({
        x: 200,
        y: 200,
      });
      const bbox = legend.get('group').getCanvasBBox();
      expect(bbox.minX).toBe(200);
      expect(bbox.minY).toBe(200);
    });

    it('background', () => {
      legend.update({
        title: {
          text: '图例名',
        },
        itemHeight: null,
        maxWidth: null, // 不设置宽度
        background: {
          padding: 8,
        },
        x: 100,
        y: 100,
      });
      const bbox = legend.get('group').getCanvasBBox();
      expect(bbox.minX).toBe(100 - 0.5);
      expect(bbox.minY).toBe(100 - 0.5);
      const titleShape = legend.getElementById('c-legend-title');
      expect(titleShape.attr('x')).toBe(8);
      expect(titleShape.attr('y')).toBe(8);
      legend.update({
        maxWidth: 300,
        background: {
          padding: [10, 8],
        },
      });
      expect(titleShape.attr('x')).toBe(8);
      expect(titleShape.attr('y')).toBe(10);
      const bbox1 = legend.get('group').getCanvasBBox();
      expect(bbox1.width <= 300).toBe(true);
    });

    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });

  describe('test vertical legend', () => {
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'c',
      container,
      layout: 'vertical',
      x: 100,
      y: 100,
      items: originItems,
    });
    it('init', () => {
      expect(legend.get('layout')).toBe('vertical');
    });

    it('render', () => {
      legend.render();
      const item1 = legend.getElementById('c-legend-item-a');
      const item2 = legend.getElementById('c-legend-item-b');
      expect(item1.getCanvasBBox().minX).toBe(item2.getCanvasBBox().minX);
      expect(item2.getCanvasBBox().minY - item1.getCanvasBBox().minY).toBe(12 + 8); // 字体高度加间距 = 行高
    });

    it('itemHeight', () => {
      legend.update({
        itemHeight: 24,
      });
      const item1 = legend.getElementById('c-legend-item-a');
      const item2 = legend.getElementById('c-legend-item-b');
      expect(item2.getCanvasBBox().minY - item1.getCanvasBBox().minY).toBe(24);
    });
    xit('itemWidth', () => {
      // 纵向布局时
    });

    it('items', () => {
      const marker = { symbol: 'circle', r: 4, stroke: 'red', fill: 'white' };
      const items = [
        { id: '1', name: '1111111111111111111', value: '1', marker },
        { id: '2', name: '22222222222', value: '2', marker },
        { id: '3', name: '3333333333333333333333', value: '3', marker },
        { id: '4', name: '444', value: '4', marker },
      ];
      legend.update({
        items,
      });
      expect(legend.getElementById('c-legend-item-group')).not.toBe(undefined);
    });

    xit('max width', () => {
      // 单行时限制 legend 的宽度，需要同设计师讨论
    });

    xit('max height', () => {
      // 翻页时准备
    });
  });
});
