import { Canvas } from '@antv/g-canvas';
import { Axis } from '../../src/index';

describe('#196', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 600,
    height: 600,
  });

  const group = canvas.addGroup();
  const config = {
    start: { x: 50, y: 400 },
    end: { x: 300, y: 400 },
    ticks: [
      { id: '0', name: '0.00', value: 0 },
      { id: '1000000', name: '1000000.00', value: 0.2 },
      { id: '2000000', name: '2000000.00', value: 0.4 },
      { id: '3000000', name: '3000000.00', value: 0.6 },
      { id: '4000000', name: '4000000.00', value: 0.8 },
      { id: '5000000', name: '5000000.00', value: 1 },
    ],
    verticalFactor: -1,
    label: {
      autoHide: false,
      autoRotate: false,
      autoEllipsis: true,
    },
    verticalLimitLength: 60,
    position: 'bottom',
    visible: true,
  };

  const axis = new Axis.Line({ container: group.addGroup(), ...config });
  axis.init();
  axis.render();

  test('only autoEllipsis', () => {
    // @ts-ignore
    const [t0 ,t1, t2] = axis.getContainer().getChildren()[0].getChildren()[1].getChildren();

    expect(t0.get('tip')).toBe(null);
    expect(t0.attr('text')).toBe('0.00');

    expect(t1.get('tip')).toBe('1000000.00');
    expect(t1.attr('text')).toBe('10000…');

    expect(t2.get('tip')).toBe('2000000.00');
    expect(t2.attr('text')).toBe('20000…');
  });
});
