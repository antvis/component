import { Canvas } from '@antv/g-canvas';
import { Slider } from '../../../src/slider/slider';
import { simulateMouseEvent } from '../../util/simulate';
import { TrendData } from '../trend/constant';

describe('slider', () => {
  const div = document.createElement('div');
  div.id = 'canvas';
  document.body.appendChild(div);

  const canvas = new Canvas({
    container: 'canvas',
    width: 400,
    height: 400,
  });

  const slider = new Slider({
    id: 's',
    container: canvas.addGroup(),
    x: 50,
    y: 300,
    width: 200,
    height: 16,

    trendCfg: {
      data: TrendData,
      isArea: true,
    },

    start: 0.1,
    end: 0.9,
    minText: 'min',
    maxText: 'max',
  });

  const containerDOM = canvas.get('container');

  it('render', () => {
    slider.render();

    expect(slider.get('x')).toEqual(50);
    expect(slider.get('y')).toEqual(300);
    expect(slider.get('width')).toEqual(200);
    expect(slider.get('height')).toEqual(16);

    expect(slider.get('textStyle').textBaseline).toEqual('middle');
  });

  it('update', () => {
    slider.update({
      minText: 'new min',
      maxText: 'new max',
      start: 0.8,
      end: 1.1,
    });
    expect(slider.get('start')).toEqual(0.8);
    expect(slider.get('end')).toEqual(1);
    expect(slider.get('minText')).toEqual('new min');
    expect(slider.get('maxText')).toEqual('new max');
  });

  it('drag', (done) => {
    slider.on('sliderchange', (range) => {
      expect(range).toEqual([0.8 - 20 / 200, 1.0 - 20 / 200]);
      done();
      slider.off('sliderchange');
    });

    slider.getElementByLocalId('foreground').emit('mousedown', {
      originalEvent: {
        pageX: 70,
        pageY: 70,
        stopPropagation: () => {},
        preventDefault: () => {},
      },
    });

    simulateMouseEvent(containerDOM, 'mousemove', {
      clientX: 50,
      clientY: 50,
    });

    simulateMouseEvent(containerDOM, 'mouseup', {});
  });
});
