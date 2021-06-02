import { Canvas } from '@antv/g-canvas';
import CategroyLegend from '../../../src/legend/category';

describe('test symbol and style callback', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'clc1';
  const canvas = new Canvas({
    container: 'clc1',
    width: 500,
    height: 500,
  });

  const container = canvas.addGroup();
  const items = [
    { name: 'X', value: 123 },
    { name: 'Y', value: 456 },
  ];
  const legend = new CategroyLegend({
    id: 'legend',
    container,
    x: 100,
    y: 100,
    items: items,
    updateAutoRender: true,
    itemBackground: null,
  });

  legend.init();

  legend.render();
  it('init', () => {
    legend.init();
    expect(legend.get('name')).toBe('legend');
    expect(legend.get('type')).toBe('category');
    expect(legend.getLocation()).toEqual({ x: 100, y: 100 });
  });


  it('itemName', () => {
    legend.update({
      itemName: {
        style: (itemName, items, index) => {
          return {
            stroke: '1',
            strokeWidth: itemName === 'X' ? 'A' : itemName === 'Y' ? 'yi' : 'notFound',
            fill: index === 0 ? 'duck' : 'chick',
          };
        },
        formatter(value) {
          return `itemName: ${value}`;
        },
      },
    });
    const item1 = legend.getElementById('legend-legend-item-X');
    expect(item1.getChildren()[1].attr('strokeWidth')).toBe('A');
    expect(item1.getChildren()[1].attr('text')).toBe('itemName: X');
    expect(item1.getChildren()[1].attr('fill')).toBe('duck');

    const item2 = legend.getElementById('legend-legend-item-Y');
    expect(item2.getChildren()[1].attr('strokeWidth')).toBe('yi');
    expect(item2.getChildren()[1].attr('text')).toBe('itemName: Y');
    expect(item2.getChildren()[1].attr('fill')).toBe('chick');
  });

  it('itemValue', () => {
    legend.update({
      itemValue: {
        style: (itemValue, item, index) => {
          return {
            fill: itemValue === 123 ? 'FA' : itemValue === 456 ? 'fyi' : 'FnotFound',
          };
        },
        formatter(value) {
          return `itemValue: ${value}`;
        },
      },
    });

    const item1 = legend.getElementById('legend-legend-item-X');
    expect(item1.getChildren()[2].attr('fill')).toBe('FA');
    expect(item1.getChildren()[2].attr('text')).toBe('itemValue: 123');

    const item2 = legend.getElementById('legend-legend-item-Y');
    expect(item2.getChildren()[2].attr('fill')).toBe('fyi');
    expect(item2.getChildren()[2].attr('text')).toBe('itemValue: 456');
  });
});
