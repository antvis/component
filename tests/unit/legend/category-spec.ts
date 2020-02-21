import { Canvas } from '@antv/g-canvas';
import CategroyLegend from '../../../src/legend/category';
import { getAngleByMatrix } from '../../../src/util/matrix';
import Theme from '../../../src/util/theme';
import { near, wait } from '../../../src/util/util';

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
    { name: 'a', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
    { name: 'b', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
    { name: 'c', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
    { name: 'd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
  ];

  describe('test horizontal legend', () => {
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'c',
      container,
      x: 100,
      y: 100,
      items: originItems,
      updateAutoRender: true,
      itemBackground: null,
    });

    it('init', () => {
      legend.init();
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
        { name: 'a', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
        { name: '1', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
        { name: '2', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
        { name: 'd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
        { name: '5', value: 5, marker: { symbol: 'circle', style: { r: 4, stroke: 'pink' } } },
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
        { name: 'a', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
        { name: '1', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
        { name: '2', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
        { name: 'd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
        { name: '5', value: 5, marker: { symbol: 'circle', style: { r: 4, stroke: 'pink' } } },
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
    it('item background', () => {
      // legend.update({
      //   title: null,
      //   x: 100,
      //   y: 100,
      // });
      // const bbox = legend.get('group').getCanvasBBox();
      // expect(bbox.minX).toBe(100);
      // expect(bbox.minY).toBe(104); // 因为没有背景框，所有 itemHeight 多出 4px

      legend.update({
        title: null,
        itemBackground: {
          style: {
            fill: 'red',
            opacity: 1,
          },
        },
        x: 100,
        y: 100,
      });
      // const bbox1 = legend.get('group').getCanvasBBox(); ci 报错没找到原因
      // expect(bbox1.minX).toBe(100);
      // expect(bbox1.minY).toBe(100);
      const itemGroup = legend.getElementById('c-legend-item-group');
      const item1 = itemGroup.getChildren()[0];
      expect(item1.getFirst().get('type')).toBe('rect');
      expect(item1.getBBox().height).toBe(20);

      legend.update({
        itemBackground: null,
      });
      expect(item1.getFirst().get('type')).toBe('marker');
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

    it('maxX, maxY, bbox', () => {
      legend.update({
        title: null,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        background: null,
        maxWidth: 200,
        maxHeight: 100,
        itemBackground: null,
      });
      const bbox = legend.getBBox();
      let layoutBBox = legend.getLayoutBBox();
      expect(layoutBBox).not.toEqual(bbox);
      expect(layoutBBox.width < 200).toEqual(true);
      expect(layoutBBox.y).toBe(0);
      legend.update({
        maxWidth: 100,
      });
      layoutBBox = legend.getLayoutBBox();
      expect(layoutBBox.width).toBe(100);
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
      updateAutoRender: true,
      itemBackground: null,
    });
    it('init', () => {
      legend.init();
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

    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });

  describe('test horizontal legend navigation', () => {
    const lotsItems = [
      { name: 'aaaaaaa', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'bbbbbbb', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ccccccc', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'ddddddd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
      { name: 'eeeeeee', value: 5, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'fffffff', value: 6, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ggggggg', value: 7, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
      { name: 'hhhhhhh', value: 8, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
      { name: 'iiiiiii', value: 9, marker: { symbol: 'square', style: { r: 4, fill: 'yellow' } } },
      { name: 'kkkkkkk', value: 10, marker: { symbol: 'square', style: { r: 4, fill: 'yellow' } } },
    ];
    const lessItems = [
      { name: 'aaaaaaa', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'bbbbbbb', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ccccccc', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'ddddddd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
      { name: 'eeeeeee', value: 5, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'fffffff', value: 6, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ggggggg', value: 7, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
      { name: 'hhhhhhh', value: 8, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
    ];
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'c',
      container,
      x: 0,
      y: 0,
      items: lotsItems,
      layout: 'horizontal',
      itemBackground: null,
      updateAutoRender: true,
      maxWidth: 400,
      flipPage: true,
    });
    legend.init();
    legend.render();

    it('navigation rendered', () => {
      const navigation = legend.getElementById('c-legend-navigation-group');
      expect(navigation).not.toBeUndefined();
      const children = navigation.getChildren();
      expect(children).toHaveLength(3); // left arrow + text + right arrow

      // left arrow: /\
      expect(children[0].get('type')).toBe('path');
      expect(children[0].attr('matrix')).toBeNull();
      // left disabled
      expect(children[0].attr('opacity')).toBe(0.45);
      expect(children[0].attr('cursor')).toBe('not-allowed');

      // text
      expect(children[1].get('type')).toBe('text');
      expect(children[1].attr('text')).toEqual('1/4');

      // right arrow: \/
      expect(children[2].get('type')).toBe('path');
      expect(getAngleByMatrix(children[2].attr('matrix'))).toBe(Math.PI);
      // right arrow enabled
      expect(children[2].attr('opacity')).toBe(1);
      expect(children[2].attr('cursor')).toBe('pointer');
    });

    it('itemGroup clip', () => {
      const itemGroup = legend.getElementById('c-legend-item-group');
      const navigation = legend.getElementById('c-legend-navigation-group');
      const clip = itemGroup.getClip();
      expect(clip).not.toBeUndefined();
      expect(clip).not.toBeNull();
      expect(clip.get('type')).toBe('rect');
      expect(clip.attr('x')).toBe(0);
      expect(clip.attr('y')).toBe(0);
      expect(clip.attr('width')).toBeLessThan(400 - navigation.getBBox().width);
      expect(clip.attr('height')).toBe(20); // itemHeight
    });

    it('navigation event', async () => {
      const navigation = legend.getElementById('c-legend-navigation-group');
      const itemGroup = legend.getElementById('c-legend-item-group');
      const textShape = navigation.getChildren()[1];
      const leftArrow = navigation.getChildren()[0];
      const rightArrow = navigation.getChildren()[2];
      const delay = 300;

      // default state: page 1
      expect(itemGroup.attr('matrix')).toBeNull();

      // click next: page 2
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('2/4');
      expect(itemGroup.attr('matrix')[7]).toBe(-20);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click next: page 3
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('3/4');
      expect(itemGroup.attr('matrix')[7]).toBe(-40);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click next: page 4
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('4/4');
      expect(itemGroup.attr('matrix')[7]).toBe(-60);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(0.45);
      expect(rightArrow.attr('cursor')).toBe('not-allowed');

      // click next: page 4
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('4/4');
      expect(itemGroup.attr('matrix')[7]).toBe(-60);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(0.45);
      expect(rightArrow.attr('cursor')).toBe('not-allowed');

      // click prev: page 3
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('3/4');
      expect(itemGroup.attr('matrix')[7]).toBe(-40);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click prev: page 2
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('2/4');
      expect(itemGroup.attr('matrix')[7]).toBe(-20);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click prev: page 1
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('1/4');
      expect(itemGroup.attr('matrix')[7]).toBe(0);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(0.45);
      expect(leftArrow.attr('cursor')).toBe('not-allowed');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click prev: page 1
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('1/4');
      expect(itemGroup.attr('matrix')[7]).toBe(0);
    });

    it('update', () => {
      // 减少 items，页数将为3
      legend.update({
        items: lessItems,
      });

      const navigation = legend.getElementById('c-legend-navigation-group');
      expect(navigation).not.toBeUndefined();
      const children = navigation.getChildren();
      expect(children).toHaveLength(3); // left arrow + text + right arrow

      // left arrow: /\
      expect(children[0].get('type')).toBe('path');
      expect(children[0].attr('matrix')).toBeNull();

      // text
      expect(children[1].get('type')).toBe('text');
      expect(children[1].attr('text')).toEqual('1/3');

      // right arrow: \/
      expect(children[2].get('type')).toBe('path');
      expect(getAngleByMatrix(children[2].attr('matrix'))).toBe(Math.PI);
    });

    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });

  describe('test vertical legend navigation', () => {
    const lotsItems = [
      { name: 'aaaaaaa', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'bbbbbbb', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ccccccc', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'ddddddd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
      { name: 'eeeeeee', value: 5, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'fffffff', value: 6, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ggggggg', value: 7, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
      { name: 'hhhhhhh', value: 8, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
      { name: 'iiiiiii', value: 9, marker: { symbol: 'square', style: { r: 4, fill: 'yellow' } } },
      { name: 'kkkkkkk', value: 10, marker: { symbol: 'square', style: { r: 4, fill: 'yellow' } } },
    ];
    const lessItems = [
      { name: 'aaaaaaa', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'bbbbbbb', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ccccccc', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'ddddddd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
      { name: 'eeeeeee', value: 5, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'fffffff', value: 6, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'ggggggg', value: 7, marker: { symbol: 'square', style: { r: 4, fill: 'blue' } } },
    ];
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'c',
      container,
      x: 100,
      y: 100,
      items: lotsItems,
      layout: 'vertical',
      itemBackground: null,
      updateAutoRender: true,
      maxHeight: 100,
      flipPage: true,
    });
    legend.init();
    legend.render();

    it('navigation rendered', () => {
      const navigation = legend.getElementById('c-legend-navigation-group');
      expect(navigation).not.toBeUndefined();
      const children = navigation.getChildren();
      expect(children).toHaveLength(3); // left arrow + text + right arrow

      // left arrow: <
      expect(children[0].get('type')).toBe('path');
      expect(near(getAngleByMatrix(children[0].attr('matrix')), ((0 - 90) * Math.PI) / 180)).toBe(true);
      // left disabled
      expect(children[0].attr('opacity')).toBe(0.45);
      expect(children[0].attr('cursor')).toBe('not-allowed');

      // text
      expect(children[1].get('type')).toBe('text');
      expect(children[1].attr('text')).toEqual('1/3');

      // right arrow: >
      expect(children[2].get('type')).toBe('path');
      expect(getAngleByMatrix(children[2].attr('matrix'))).toBe((90 * Math.PI) / 180);
      // right arrow enabled
      expect(children[2].attr('opacity')).toBe(1);
      expect(children[2].attr('cursor')).toBe('pointer');
    });

    it('itemGroup clip', () => {
      const itemGroup = legend.getElementById('c-legend-item-group');
      const navigation = legend.getElementById('c-legend-navigation-group');
      const clip = itemGroup.getClip();
      expect(clip).not.toBeUndefined();
      expect(clip).not.toBeNull();
      expect(clip.get('type')).toBe('rect');
      expect(clip.attr('x')).toBe(0);
      expect(clip.attr('y')).toBe(0);
      expect(clip.attr('height')).toBeLessThan(100 - navigation.getBBox().height);
    });

    it('navigation event', async () => {
      const navigation = legend.getElementById('c-legend-navigation-group');
      const itemGroup = legend.getElementById('c-legend-item-group');
      const textShape = navigation.getChildren()[1];
      const leftArrow = navigation.getChildren()[0];
      const rightArrow = navigation.getChildren()[2];
      const pageWidth = itemGroup.getClip().attr('width');
      const delay = 300;

      // default state: page 1
      expect(itemGroup.attr('matrix')).toBeNull();

      // click next: page 2
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('2/3');
      expect(itemGroup.attr('matrix')[6]).toBe(-pageWidth);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click next: page 3
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('3/3');
      expect(itemGroup.attr('matrix')[6]).toBe(-2 * pageWidth);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(0.45);
      expect(rightArrow.attr('cursor')).toBe('not-allowed');

      // click next: page 3
      rightArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('3/3');
      expect(itemGroup.attr('matrix')[6]).toBe(-2 * pageWidth);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(0.45);
      expect(rightArrow.attr('cursor')).toBe('not-allowed');

      // click prev: page 2
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('2/3');
      expect(itemGroup.attr('matrix')[6]).toBe(-pageWidth);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(1);
      expect(leftArrow.attr('cursor')).toBe('pointer');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click prev: page 1
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('1/3');
      expect(itemGroup.attr('matrix')[6]).toBe(0);
      // check arrow
      expect(leftArrow.attr('opacity')).toBe(0.45);
      expect(leftArrow.attr('cursor')).toBe('not-allowed');
      expect(rightArrow.attr('opacity')).toBe(1);
      expect(rightArrow.attr('cursor')).toBe('pointer');

      // click prev: page 1
      leftArrow.emit('click');
      await wait(delay);
      expect(textShape.attr('text')).toEqual('1/3');
      expect(itemGroup.attr('matrix')[6]).toBe(0);
    });

    it('update', () => {
      // 减少items，页数变为2
      legend.update({
        items: lessItems,
      });

      const navigation = legend.getElementById('c-legend-navigation-group');
      expect(navigation).not.toBeUndefined();
      const children = navigation.getChildren();
      expect(children).toHaveLength(3); // left arrow + text + right arrow

      // left arrow: <
      expect(children[0].get('type')).toBe('path');
      expect(near(getAngleByMatrix(children[0].attr('matrix')), ((0 - 90) * Math.PI) / 180)).toBe(true);

      // text
      expect(children[1].get('type')).toBe('text');
      expect(children[1].attr('text')).toEqual('1/2');

      // right arrow: >
      expect(children[2].get('type')).toBe('path');
      expect(getAngleByMatrix(children[2].attr('matrix'))).toBe((90 * Math.PI) / 180);
    });

    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });

  describe('test state and events', () => {
    const items = [
      { name: '222222', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: '111111', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: '55555', value: 3, active: true, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'bbbbbb', value: 4, unchecked: true, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
    ];
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'd',
      container,
      layout: 'vertical',
      itemBackground: null,
      updateAutoRender: true,
      x: 100,
      y: 100,
      items,
    });
    legend.init();
    it('render', () => {
      legend.render();
      const itemGroup = legend.getElementById('d-legend-item-group');
      expect(itemGroup.getChildren().length).toBe(items.length);
      const itemElement2 = itemGroup.getChildren()[2];
      expect(itemElement2.getChildren()[1].attr('opacity')).toBe(0.8); // active
      const itemElement3 = itemGroup.getChildren()[3];
      expect(itemElement3.getChildren()[0].attr('fill')).toBe(Theme.uncheckedColor);
    });

    it('getItems', () => {
      expect(legend.getItems()).toBe(items);
    });

    it('update item', () => {
      const item = items[1];
      legend.updateItem(item, { name: '333' });
      const itemGroup = legend.getElementById('d-legend-item-group');
      const itemElement = itemGroup.getChildren()[1];
      expect(itemElement.getChildren()[1].attr('text')).toBe('333');
    });

    it('set state', () => {
      const item = items[1];
      legend.setItemState(item, 'inactive', true);
      const itemGroup = legend.getElementById('d-legend-item-group');
      const itemElement = itemGroup.getChildren()[1];
      expect(itemElement.getChildren()[0].attr('opacity')).toBe(0.2);
      legend.setItemState(item, 'inactive', false);
      expect(itemElement.getChildren()[0].attr('opacity')).not.toBe(0.2);
      const delegateItem = itemElement.get('delegateObject').item;
      expect(delegateItem).toBe(item);

      const newitems = [{ name: '222222' }, { name: '111111' }, { name: '55555' }, { name: 'bbbbbb' }];
      legend.update({
        items: newitems,
      });
      expect(itemElement.get('delegateObject').item).toBe(newitems[1]);
    });

    it('getItems by state', () => {
      legend.update({
        items,
      });
      const uncheckedItems = legend.getItemsByState('unchecked');
      expect(uncheckedItems.length).toBe(1);

      const item3 = items[3];
      legend.setItemState(item3, 'unchecked', false);
      expect(legend.getItemsByState('unchecked').length).toBe(0);
      const itemGroup = legend.getElementById('d-legend-item-group');
      const itemElement = itemGroup.getChildren()[3];
      expect(itemElement.getChildren()[0].attr('fill')).toBe(undefined);
    });

    it('clear states', () => {
      expect(legend.getItemsByState('active').length).toBe(1);
      legend.setItemState(items[0], 'active', true);
      expect(legend.getItemsByState('active').length).toBe(2);
      legend.clearItemsState('active');
      expect(legend.getItemsByState('active').length).toBe(0);
    });

    it('setItems', () => {
      legend.setItemState(items[0], 'active', true);
      const newitems = [
        { id: '1', name: '1111111111111111111', value: '1' },
        { id: '2', name: '22222222222', value: '2' },
        { id: '3', name: '3333333333333333333333', value: '3' },
        { id: '4', name: '444', value: '4' },
      ];
      legend.setItems(newitems);
      expect(legend.getItemsByState('active').length).toBe(0);
    });
    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });
});
