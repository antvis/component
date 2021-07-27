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
    { name: 'a', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
    { name: 'b', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
    { name: 'c', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
    { name: 'd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
  ];

  const marker = { symbol: 'circle', style: { r: 4, stroke: 'red', fill: 'white' } };
  const moreItems = [
    { id: '1', name: '11111', value: '1', marker },
    { id: '2', name: '2222', value: '2', marker },
    { id: '3', name: '3333333333333333333333', value: '3', marker },
    { id: '4', name: '444', value: '4', marker },
    { id: '5', name: '555', value: '5', marker },
    { id: '6', name: '666', value: '6', marker },
    { id: '7', name: '777555224', value: '7', marker },
  ]

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
    legend.init();
    legend.render();
    const legend2 = new CategroyLegend({
      id: 'c2',
      container,
      x: 100,
      y: 300,
      items: moreItems,
      maxHeight: 60,
      updateAutoRender: true,
      itemBackground: null,
      layout: 'vertical'
    });
    legend2.init();
    legend2.render();

    it('max width auto wrap', () => {
      legend.update({
        itemWidth: null,
        maxWidth: 500,
        itemValue: null,
        position: 'horizontal',
        items: moreItems,
      });
      const itemGroup = legend.getElementById('c-legend-item-group');
      const item2 = itemGroup.getChildren()[1];
      const item3 = itemGroup.getChildren()[2];
      expect(item2.getCanvasBBox().minY).toBe(item3.getCanvasBBox().minY);
      legend.update({
        maxWidth: 220,
      });
      expect(item2.getCanvasBBox().minY).not.toBe(item3.getCanvasBBox().minY);
    });

    it('flipPage', () => {
      legend.update({ flipPage: true });
      legend2.update({ flipPage: true });
      let itemGroup = legend.getElementById('c-legend-item-group');
      expect(itemGroup.getParent().getClip().getBBox().height).toBe(12)

      legend.update({ flipPageRows: 2 });
      itemGroup = legend.getElementById('c-legend-item-group');
      expect(itemGroup.getParent().getClip().getBBox().height).toBe(24)
    });

    it('flipPageRows', () => {
      legend.update({ flipPageRows: 3 });
      const itemGroup = legend.getElementById('c-legend-item-group');
      expect(itemGroup.getParent().getClip().getBBox().height).toBe(36)
    });

    afterAll(() => {
      legend.destroy();
      legend2.destroy();
    })
  });
});