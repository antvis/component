import { Canvas } from '@antv/g-canvas';
import { Legend } from '../../src/index';

describe('legend offsetX, offsetY', () => {
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
      { name: 'A', value: 1, marker: { symbol: 'circle', style: { r: 4, stroke: 'red' } } },
      { name: 'B', value: 2, marker: { symbol: 'square', style: { r: 4, fill: 'red' } } },
      { name: 'C', value: 3, marker: { symbol: 'circle', style: { r: 4, stroke: 'blue' } } },
      { name: 'D', value: 4, marker: { symbol: 'circle', style: { r: 4, stroke: 'yellow' } } },
    ],
    x: 100,
    y: 100,
    offsetX: -100,
    offsetY: 100,
    updateAutoRender: false,
  });
  legend.init();

  it('legend render/update', () => {
    legend.render();

    let x = legend.getLayoutBBox().x;
    let y = legend.getLayoutBBox().y;
    let width = legend.getLayoutBBox().width;
    let height = legend.getLayoutBBox().height;
    expect({ x, y, height }).toEqual({ x: 0, y: 200, height: 12 });
    expect(width).toBeGreaterThan(150);
    
    legend.setLocation({
      x: 100,
      y: 100,
    });

    x = legend.getLayoutBBox().x;
    y = legend.getLayoutBBox().y;
    width = legend.getLayoutBBox().width;
    height = legend.getLayoutBBox().height;
    expect({ x, y, height }).toEqual({ x: 0, y: 200, height: 12 });
    expect(width).toBeGreaterThan(150);

    legend.setLocation({
      x: 0,
      y: 100,
    });

    x = legend.getLayoutBBox().x;
    y = legend.getLayoutBBox().y;
    width = legend.getLayoutBBox().width;
    height = legend.getLayoutBBox().height;
    expect({ x, y, height }).toEqual({ x: -100, y: 200, height: 12 });
    expect(width).toBeGreaterThan(150);
  });
});
