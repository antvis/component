import { Canvas } from '@antv/g-canvas';
import LineAxis from '../../../src/axis/line';

describe('line axis empty', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cal';
  const canvas = new Canvas({
    container: 'cal',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const axis = new LineAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start: { x: 50, y: 50 },
    end: { x: 400, y: 50 },
    ticks: [
      { name: '1', value: 0 },
      { name: '2', value: 0.5 },
      { name: '3', value: 1 },
    ],
    label: null,
    line: null,
  });

  axis.init();
  axis.render();

  it('getBBox, getLayoutBBox', () => {
    expect(axis.getBBox().width).toBe(0);
    expect(axis.getBBox().height).toBe(0);

    expect(axis.getLayoutBBox().width).toBe(350);
    expect(axis.getLayoutBBox().height).toBe(0);
  });
});
