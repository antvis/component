import { Canvas } from '@antv/g-canvas';
import LineAnnotation from '../../../src/annotation/line';
import { getMatrixByAngle } from '../../../src/util/matrix';

describe('test line annotation', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'canl';
  const canvas = new Canvas({
    container: 'canl',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const line = new LineAnnotation({
    id: 'l',
    container,
    updateAutoRender: true,
    start: { x: 100, y: 100 },
    end: { x: 200, y: 200 },
  });

  it('init', () => {
    expect(line.get('name')).toBe('annotation');
    expect(line.get('type')).toBe('line');
  });

  it('render', () => {
    line.render();
    const lineShape = line.getElementById('l-annotation-line');
    expect(lineShape.attr('x1')).toBe(100);
    expect(lineShape.attr('x2')).toBe(200);
  });

  it('location', () => {
    line.setLocation({
      start: { x: 0, y: 100 },
      end: { x: 0, y: 200 },
    });
    const lineShape = line.getElementById('l-annotation-line');
    expect(lineShape.attr('x1')).toBe(0);
    expect(lineShape.attr('x2')).toBe(0);
    expect(lineShape.attr('y2')).toBe(200);
  });

  it('update text', () => {
    line.update({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 100 },
      text: {
        content: 'line text',
        autoRotate: false,
      },
    });
    const textShape = line.getElementById('l-annotation-line-text');
    expect(textShape.attr('text')).toBe('line text');
    expect(textShape.attr('matrix')).toBe(null);
    expect(textShape.attr('x')).toBe(50);
    expect(textShape.attr('y')).toBe(50);
    line.update({
      text: {
        content: 'line text',
        autoRotate: true,
      },
    });
    const m = getMatrixByAngle({ x: 50, y: 50 }, Math.PI / 4);
    expect(textShape.attr('matrix')).toEqual(m);
    line.update({
      text: null,
    });
    expect(line.getElementById('l-annotation-line-text')).toBe(undefined);
  });

  it('text position', () => {
    line.update({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 100 },
      text: {
        position: 'start',
        content: 'line text',
        autoRotate: false,
      },
    });
    const textShape = line.getElementById('l-annotation-line-text');
    expect(textShape.attr('x')).toBe(0);
    expect(textShape.attr('y')).toBe(0);

    line.update({
      text: {
        position: 'end',
        content: 'line text',
        autoRotate: false,
      },
    });
    expect(textShape.attr('x')).toBe(100);
    expect(textShape.attr('y')).toBe(100);

    line.update({
      text: {
        position: '40%',
        content: 'line text',
        autoRotate: false,
      },
    });
    expect(textShape.attr('x')).toBe(40);
    expect(textShape.attr('y')).toBe(40);
  });

  it('destroy', () => {
    line.destroy();
    expect(line.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
