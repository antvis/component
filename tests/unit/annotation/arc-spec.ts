import { Canvas } from '@antv/g-canvas';
import ArcAnnotation from '../../../src/annotation/arc';

describe('test arc annotation', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cana';
  const canvas = new Canvas({
    container: 'cana',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const arc = new ArcAnnotation({
    id: 'a',
    container,
    center: { x: 200, y: 200 },
    radius: 100,
    style: {
      lineWidth: 5,
      stroke: 'red',
    },
  });
  it('init', () => {
    expect(arc.get('name')).toBe('annotation');
    expect(arc.get('type')).toBe('arc');
    expect(arc.getLocation()).toEqual({
      center: { x: 200, y: 200 },
      radius: 100,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
    });
  });

  it('render', () => {
    arc.render();
    const shape = arc.getElementById('a-annotation-arc');
    expect(shape).not.toBe(undefined);
    expect(shape.attr('path').length).toBe(3);
  });

  it('update', () => {
    arc.update({
      endAngle: Math.PI / 2,
    });
    const shape = arc.getElementById('a-annotation-arc');
    expect(shape.attr('path')).toEqual([['M', 200, 100], ['A', 100, 100, 0, 0, 1, 200, 300]]);
  });

  it('destroy', () => {
    arc.destroy();
    expect(arc.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
