import { Canvas } from '@antv/g-canvas';
import RegionAnnotation from '../../../src/annotation/region';

describe('test region annotation', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'canr';
  const canvas = new Canvas({
    container: 'canr',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const region = new RegionAnnotation({
    id: 'r',
    container,
    start: { x: 100, y: 100 },
    updateAutoRender: true,
    end: { x: 200, y: 200 },
  });

  it('init', () => {
    expect(region.get('name')).toBe('annotation');
    expect(region.get('type')).toBe('region');
    expect(region.getLocation()).toEqual({
      start: { x: 100, y: 100 },
      end: { x: 200, y: 200 },
    });
  });

  it('render', () => {
    region.render();
    const shape = region.getElementById('r-annotation-region');
    expect(shape).not.toBe(undefined);
    expect(shape.attr('x')).toBe(100);
    expect(shape.attr('y')).toBe(100);
    expect(shape.attr('width')).toBe(100);
    expect(shape.attr('height')).toBe(100);
  });

  it('update location', () => {
    region.update({
      start: { x: 150, y: 150 },
    });
    const shape = region.getElementById('r-annotation-region');
    expect(shape.attr('x')).toBe(150);
    expect(shape.attr('y')).toBe(150);
    expect(shape.attr('width')).toBe(50);
    expect(shape.attr('height')).toBe(50);
  });

  it('update style', () => {
    region.update({
      style: {
        fill: 'red',
      },
    });
    const shape = region.getElementById('r-annotation-region');
    expect(shape.attr('fill')).toBe('red');
  });

  it('destroy', () => {
    region.destroy();
    expect(region.destroyed).toBe(true);
  });
});
