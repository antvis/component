import { Canvas } from '@antv/g-canvas';
import { Axis } from '../../src/index';

describe('axis title spacing', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 600,
    height: 600,
  });

  const group = canvas.addGroup();
  const config = {
    start: { x: 0, y: 400 },
    end: { x: 500, y: 400 },
    ticks: [
      { id: '0', name: '0.00', value: 0 },
      { id: '1000000', name: '1000000.00', value: 0.2 },
      { id: '2000000', name: '2000000.00', value: 0.4 },
      { id: '3000000', name: '3000000.00', value: 0.6 },
      { id: '4000000', name: '4000000.00', value: 0.8 },
      { id: '5000000', name: '5000000.00', value: 1 },
    ],
    verticalFactor: -1,
    title: {
      style: { text: 'sales', fill: 'rgba(0, 0, 0, 0.65)', fontSize: 12 },
      visible: true,
      // offset: 12,
      spacing: 12,
    },
    label: null,
    line: null,
    tickLine: null,
    subTickLine: null,
    position: 'left',
    grid: null,
    visible: true,
    autoRotateTitle: false,
    nice: true,
    showTitle: true,
  };

  const axis = new Axis.Line({ container: group.addGroup(), ...config });
  axis.init();
  axis.render();

  it('render', () => {
    const bbox = axis.getLayoutBBox();
    expect(bbox.x).not.toBeNaN();
    expect(bbox.y).not.toBeNaN();
    expect(bbox.width).not.toBeNaN();
    expect(bbox.height).not.toBeNaN();
  });
});
