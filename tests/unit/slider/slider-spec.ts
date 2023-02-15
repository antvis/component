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
  slider.init();

  const containerDOM = canvas.get('container');

  it('setRange/getRange', () => {
    let curRange = slider.getRange();
    expect(curRange.min).toBe(0);
    expect(curRange.max).toBe(1);

    slider.setRange(0.1, 0.2);
    curRange = slider.getRange();
    expect(curRange.min).toBe(0.1);
    expect(curRange.max).toBe(0.2);
  });

  it('update after init', () => {
    slider.update({
      x: 0,
      y: 0,
    });
    slider.update({
      x: 50,
      y: 300,
    });

    expect(slider.get('x')).toEqual(50);
    expect(slider.get('y')).toEqual(300);
  });

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
    slider.render();
    expect(slider.get('start')).toEqual(0.8);
    expect(slider.get('end')).toEqual(1);
    expect(slider.get('minText')).toEqual('new min');
    expect(slider.get('maxText')).toEqual('new max');
  });

  it('getValue/setValue', () => {
    slider.setRange(0, 1);
    slider.update({
      start: 0,
      end: 1,
    });
    slider.render();
    const curValue = slider.getValue();
    expect(curValue).toEqual([0, 1]);

    slider.setValue([0.1, 0.3]);
    expect(slider.getValue()).toEqual([0.1, 0.3]);
    expect(slider.get('start')).toBe(0.1);
    expect(slider.get('end')).toBe(0.3);

    slider.setValue([0, 0.6]);
    slider.setRange(0, 0.5);
    slider.setValue([0.1, 0.6]);
    expect(slider.getValue()).toEqual([0.1, 0.5]);
    expect(slider.get('start')).toBe(0.1);
    expect(slider.get('end')).toBe(0.5);
  });

  it('drag on background', (done) => {
    slider.update({
      start: 0.8,
      end: 1,
    });
    slider.render();
    slider.on('sliderchange', (range) => {
      expect(range).toEqual([0.8 - 20 / 200, 1.0 - 20 / 200]);
      done();
      slider.off('sliderchange');
    });

    slider.emit('foreground-scroll:mousedown', {
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

  it('dnd on min handler', (done) => {
    slider.update({
      start: 0.5,
      end: 0.6,
    });
    slider.render();
    slider.on('sliderchange', (range) => {
      expect(range).toEqual([0.5 - 20 / 200, 0.6]);
      done();
      slider.off('sliderchange');
    });
    const group = slider.get('group');
    group.emit('handler-min:mousedown', {
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

  it('dnd on max handler', (done) => {
    slider.update({
      start: 0.5,
      end: 0.6,
    });
    slider.render();
    slider.on('sliderchange', (range) => {
      expect(range).toEqual([0.5, 0.6 - 20 / 200]);
      done();
      slider.off('sliderchange');
    });
    const group = slider.get('group');
    group.emit('handler-max:mousedown', {
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

  it('update height', () => {
    slider.update({
      height: 32,
      start: 0.1,
      end: 0.8,
    });

    slider.render();

    // @ts-ignore
    expect(slider.trend.get('height')).toBe(32);
    // @ts-ignore
    expect(slider.minHandler.get('y')).toBe(10);
    // @ts-ignore
    expect(slider.maxHandler.get('y')).toBe(10);
  });

  it('update handlerStyle', () => {
    // @ts-ignore
    const minHandler: Handler = slider.minHandler;
    // 默认带样式
    expect(minHandler.get('style').fill).not.toBeUndefined();
    expect(minHandler.get('style').highLightFill).not.toBeUndefined();
    expect(minHandler.get('style').stroke).not.toBeUndefined();
    slider.update({
      handlerStyle: {
        fill: 'lightgreen',
        highLightFill: 'pink',
      },
    });

    slider.render();
    // @ts-ignore
    minHandler = slider.minHandler;
    expect(minHandler.get('style').fill).toBe('lightgreen');
    expect(minHandler.get('style').highLightFill).toBe('pink');
    expect(minHandler.get('style').stroke).not.toBeUndefined();
  });

  afterAll(() => {
    slider.destroy();
  });
});
