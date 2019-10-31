import { Canvas } from '@antv/g-canvas';
import { isNumberEqual } from '@antv/util';
import ContinueLegend from '../../../src/legend/continue';
describe('test continue legend', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'legend-contintue';
  const canvas = new Canvas({
    container: 'legend-contintue',
    width: 500,
    height: 500,
  });

  describe('test layout horizontal', () => {
    const container = canvas.addGroup();
    const legend = new ContinueLegend({
      id: 'a',
      container,
      x: 100,
      y: 100,
      min: 100,
      max: 1000,
      slidable: false,
      colors: ['red'],
    });
    it('init', () => {
      expect(legend.get('name')).toBe('legend');
      expect(legend.get('type')).toBe('continue');
      expect(legend.getLocation()).toEqual({ x: 100, y: 100 });
    });

    it('render', () => {
      legend.render();
      const railShape = legend.getElementById('a-legend-rail');
      expect(railShape).not.toBe(undefined);
      expect(railShape.attr('fill')).toBe(legend.get('rail').style.fill);
      expect(legend.getElementById('a-legend-track').attr('fill')).toBe('red');
      expect(legend.getValue()).toEqual([100, 1000]);
      expect(legend.getElementById('a-legend-label-min').attr('text')).toBe(100);
      expect(legend.getElementById('a-legend-label-max').attr('text')).toBe(1000);
      expect(legend.getBBox().minX).toBe(100);
      expect(legend.getBBox().minY).toBe(100);
    });

    it('change value', () => {
      legend.update({
        value: [200, 500],
      });
      expect(legend.getValue()).toEqual([200, 500]);
      expect(legend.getElementById('a-legend-rail').getBBox().width / 3).toEqual(
        legend.getElementById('a-legend-track').getBBox().width
      );

      legend.update({
        value: null, // 清空 value
      });
      expect(legend.getValue()).toEqual([100, 1000]);
      expect(legend.getElementById('a-legend-rail').getBBox()).toEqual(
        legend.getElementById('a-legend-track').getBBox()
      );
    });

    it('change min, max', () => {
      legend.update({
        min: 0,
        max: 100,
      });
      expect(legend.getElementById('a-legend-label-min').attr('text')).toBe(0);
      expect(legend.getElementById('a-legend-label-max').attr('text')).toBe(100);
      expect(legend.getElementById('a-legend-rail').getBBox()).toEqual(
        legend.getElementById('a-legend-track').getBBox()
      );
      legend.update({
        value: [0, 20],
      });
      const railShape = legend.getElementById('a-legend-rail');
      const trackShape = legend.getElementById('a-legend-track');
      let isEqual = isNumberEqual(railShape.getBBox().width / 5, trackShape.getBBox().width);
      expect(isEqual).toEqual(true);

      legend.update({
        value: [20, 40],
      });
      isEqual = isNumberEqual(railShape.getBBox().width / 5, trackShape.getBBox().width);
      expect(isEqual).toEqual(true);
    });

    it('change rail length', () => {
      legend.update({
        min: 0,
        max: 100,
        value: [20, 40],
        rail: {
          size: 10,
          defaultLength: 50,
        },
      });
      const railBBox = legend.getElementById('a-legend-rail').getBBox();
      expect(railBBox.width).toBe(50);
      expect(railBBox.height).toBe(10);
      const trackBBox = legend.getElementById('a-legend-track').getBBox();
      expect(trackBBox.width).toBe(10);
      expect(trackBBox.height).toBe(10);
    });

    it('label position', () => {
      legend.update({
        min: 0,
        max: 100,
        value: null,
        rail: {},
        label: {
          align: 'top',
        },
      });
      const minLabelShape = legend.getElementById('a-legend-label-min');
      const railShape = legend.getElementById('a-legend-rail');

      expect(minLabelShape.getBBox().maxY + 5).toBe(railShape.getBBox().minY);

      legend.update({
        label: {
          align: 'bottom',
        },
      });
      expect(minLabelShape.getBBox().minY - 5).toBe(railShape.getBBox().maxY);
    });

    it('maxWidth', () => {
      legend.update({
        maxWidth: 100,
        value: null,
        label: {
          align: 'bottom',
        },
        rail: {
          defaultLength: 100,
        },
      });
      const railShape = legend.getElementById('a-legend-rail');
      const trackShape = legend.getElementById('a-legend-track');
      const minLabelShape = legend.getElementById('a-legend-label-min');
      const maxLabelShape = legend.getElementById('a-legend-label-max');
      expect(railShape.getBBox().width).toBe(100);

      legend.update({
        maxWidth: 80,
      });
      expect(railShape.getBBox().width).toBe(80);

      legend.update({
        maxWidth: 100,
        label: {
          align: 'rail',
        },
      });
      expect(railShape.getBBox().width < 100).toBe(true);
      expect(trackShape.getBBox().width < 100).toBe(true);
      expect(railShape.getBBox().width + minLabelShape.getBBox().width + maxLabelShape.getBBox().width).toBe(100 - 10);
      legend.update({
        maxWidth: null,
      });
      expect(railShape.getBBox().width).toBe(100);
    });

    it('change colors', () => {
      legend.update({
        colors: ['#ffffff', '#1890ff'],
      });
      const trackShape = legend.getElementById('a-legend-track');
      expect(trackShape.attr('fill')).toBe('l(0) 0:#ffffff 1:#1890ff');

      legend.update({
        colors: ['#ffff00', '#00ffff', '#0000ff'],
      });
      expect(trackShape.attr('fill')).toBe('l(0) 0:#ffff00 0.5:#00ffff 1:#0000ff');
    });

    it('clear', () => {
      legend.clear();
      expect(legend.getElementById('a-legend-rail')).toBe(undefined);
    });

    it('rerender', () => {
      legend.render();
      expect(legend.getElementById('a-legend-rail')).not.toBe(undefined);
    });

    it('change location', () => {
      legend.update({ x: 200, y: 250 });
      expect(legend.getBBox().minX).toBe(200);
      expect(legend.getBBox().minY).toBe(250);
      expect(legend.getLocation()).toEqual({ x: 200, y: 250 });

      legend.setLocation({ x: 300, y: 300 });
      expect(legend.getBBox().minX).toBe(300);
      expect(legend.getBBox().minY).toBe(300);
      expect(legend.getLocation()).toEqual({ x: 300, y: 300 });
    });

    it('update title', () => {
      legend.update({
        x: 150,
        y: 150,
        title: {
          text: '这是标题',
        },
        label: {
          align: 'rail',
        },
      });
      expect(legend.getBBox().minX).toBe(150);
    });

    it('background', () => {
      legend.update({
        x: 150,
        y: 250,
        title: {
          text: '这是标题',
        },
        label: {
          align: 'rail',
        },
        rail: {
          defaultLength: 100,
        },
        background: {
          padding: 5,
          style: {
            fill: '#cdcdcd',
            opacity: 0.4,
          },
        },
      });
      expect(legend.getBBox().minX).toBe(150);
      expect(legend.getBBox().minY).toBe(250);
      const railShape = legend.getElementById('a-legend-rail');
      expect(railShape.getBBox().width).toBe(100);
      // legend.update({ 存在背景框和标题的情况下 maxWidth 的限制，需要特别计算
      //   maxWidth: 100
      // });
      // expect(legend.getBBox().width).toBe(100);
    });

    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });

  describe('test layout vertical', () => {
    const container = canvas.addGroup();
    const legend = new ContinueLegend({
      id: 'b',
      container,
      layout: 'vertical',
      x: 100,
      y: 100,
      min: 0,
      max: 1000,
      value: [200, 300],
      slidable: false,
      colors: ['red'],
    });

    it('init', () => {
      expect(legend.get('layout')).toBe('vertical');
    });

    it('render', () => {
      legend.render();
      expect(legend.getBBox().minX).toBe(100);
      expect(legend.getBBox().minY).toBe(100);
      const railShape = legend.getElementById('b-legend-rail');
      const trackShape = legend.getElementById('b-legend-track');
      const minLabelShape = legend.getElementById('b-legend-label-min');
      expect(railShape.getBBox().y).toBe(minLabelShape.getBBox().maxY + 5);

      expect(railShape.getBBox().height / 10).toBe(trackShape.getBBox().height);
    });

    it('change min, max', () => {
      const originHeight = legend.getBBox().height;
      legend.update({
        min: 100,
        max: 500,
      });
      expect(legend.getBBox().height).toBe(originHeight);
      expect(legend.getElementById('b-legend-rail').getBBox().height / 4).toBe(
        legend.getElementById('b-legend-track').getBBox().height
      );
    });

    it('change value', () => {
      legend.update({
        min: 100,
        max: 500,
        value: [100, 100],
      });
      expect(legend.getElementById('b-legend-track').getBBox().height).toBe(0);
      legend.update({
        value: null,
      });
      expect(legend.getElementById('b-legend-track').getBBox().height).toBe(legend.get('rail').defaultLength);
    });

    it('change rail', () => {
      legend.update({
        rail: {
          defaultLength: 150,
        },
        value: null,
      });
      expect(legend.getElementById('b-legend-rail').getBBox().height).toBe(150);
      expect(legend.getElementById('b-legend-track').getBBox().height).toBe(150);
    });

    it('change label position', () => {
      legend.update({
        label: {
          align: 'left',
        },
        min: 0,
        max: 100,
      });
      const railShape = legend.getElementById('b-legend-rail');
      const minLabelShape = legend.getElementById('b-legend-label-min');
      const maxLabelShape = legend.getElementById('b-legend-label-max');
      expect(railShape.getBBox().minX).toBe(maxLabelShape.getBBox().maxX + 5);
      expect(minLabelShape.attr('textAlign')).toBe('start');
      expect(minLabelShape.attr('textBaseline')).toBe('top');

      legend.update({
        label: {
          align: 'right',
        },
      });
      expect(railShape.getBBox().maxX).toBe(minLabelShape.getBBox().minX - 5);
      expect(minLabelShape.attr('textAlign')).toBe('start');
      expect(minLabelShape.attr('textBaseline')).toBe('top');
    });

    it('maxHeight', () => {
      legend.update({
        maxHeight: 200,
        label: {
          align: 'right',
        },
        rail: {
          defaultLength: 150,
        },
      });
      expect(legend.getBBox().height).toBe(150);
      legend.update({
        label: {
          align: 'left',
        },
      });
      expect(legend.getBBox().height).toBe(150);
      legend.update({
        label: {
          align: 'rail',
        },
      });
      expect(legend.getBBox().height > 150).toBe(true);
      expect(legend.getElementById('b-legend-rail').getBBox().height).toBe(150);
      legend.update({
        maxHeight: 100,
      });
      expect(legend.getBBox().height).toBe(100);
    });
    it('colors', () => {
      legend.update({
        colors: ['#ffffff', '#1890ff'],
      });
      const trackShape = legend.getElementById('b-legend-track');
      expect(trackShape.attr('fill')).toBe('l(90) 0:#ffffff 1:#1890ff');

      legend.update({
        colors: ['#ffff00', '#00ffff', '#0000ff'],
      });
      expect(trackShape.attr('fill')).toBe('l(90) 0:#ffff00 0.5:#00ffff 1:#0000ff');
    });
    it('destroy', () => {
      legend.destroy();
      expect(legend.destroyed).toBe(true);
    });
  });

  describe('test slidable', () => {
    const container = canvas.addGroup();
    const legend = new ContinueLegend({
      id: 'c',
      container,
      x: 100,
      y: 100,
      min: 0,
      max: 1000,
      value: [200, 300],
      slidable: true,
      colors: ['red'],
    });
    it('init', () => {
      expect(legend.get('slidable')).toBe(true);
    });

    it('render', () => {
      legend.render();
      const minHandler = legend.getElementById('c-legend-handler-min');
      const maxHandler = legend.getElementById('c-legend-handler-max');
      expect(minHandler).not.toBe(undefined);
      expect(maxHandler).not.toBe(undefined);
    });

    it('update value', () => {
      legend.update({
        label: {
          align: 'bottom',
        },
        rail: {
          defaultLength: 100,
        },
        value: [200, 800],
      });
      const minHandler = legend.getElementById('c-legend-handler-min');
      const maxHandler = legend.getElementById('c-legend-handler-max');
      expect(minHandler.attr('path')[0]).toEqual(['M', 20, 10]);
      expect(maxHandler.attr('path')[0]).toEqual(['M', 80, 10]);
    });

    it('change layout', () => {
      legend.update({
        layout: 'vertical',
        label: {
          align: 'right',
        },
        rail: {
          defaultLength: 100,
        },
        value: [200, 800],
      });
      const minHandler = legend.getElementById('c-legend-handler-min');
      const maxHandler = legend.getElementById('c-legend-handler-max');
      expect(minHandler.attr('path')[0]).toEqual(['M', 10, 20]);
      expect(maxHandler.attr('path')[0]).toEqual(['M', 10, 80]);
    });
  });
});
