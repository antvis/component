import { Canvas } from '@antv/g-canvas';
import { Legend } from '../../src/index';
import GraphEvent from '@antv/g-base/lib/event/graph-event';
import { LooseObject } from '../../src/types';

describe('legend text clip', () => {

  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 500,
    height: 500,
  });  

  const group = canvas.addGroup();
  const legend = new Legend.Category({
    container: group,
    items: [
      { name: 'abcdef', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'bdddd', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'cdfasdfas', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'dsadfasdfd', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
    ]
  });

  it('legend active', () => {
    legend.render();
    const items = legend.getItems();
    legend.setItemState(items[0], 'active', true);
    const text = legend.getElementsByName('legend-item-name')[0];
    expect(text.attr('opacity')).toBe(0.8);
    legend.setItemState(items[0], 'active', false);
    expect(text.attr('opacity')).not.toBe(0.8);
  });
});