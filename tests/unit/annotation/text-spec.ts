import { Canvas } from '@antv/g-canvas';
import TextAnnotation from '../../../src/annotation/text';
import { getMatrixByAngle } from '../../../src/util/matrix';
describe('test text annotation', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant';
  const canvas = new Canvas({
    container: 'cant',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  const text = new TextAnnotation({
    id: 'a',
    container,
    x: 100,
    y: 150,
    content: 'test text',
    updateAutoRender: true,
  });

  it('init', () => {
    text.init();
    expect(text.get('name')).toEqual('annotation');
    expect(text.get('type')).toBe('text');
    expect(text.getLocation()).toEqual({ x: 100, y: 150 });
  });

  it('render', () => {
    text.render();
    const textShape = text.getElementById('a-annotation-text');
    expect(textShape.attr(text.get('content')));
    expect(textShape.attr('x')).toBe(100);
    expect(textShape.attr('y')).toBe(150);
  });

  it('update text', () => {
    text.update({ content: 'change text' });
    expect(text.getElementById('a-annotation-text').attr('text')).toBe('change text');
  });

  it('update x, y', () => {
    text.update({
      x: 200,
      y: 300,
    });
    const textShape = text.getElementById('a-annotation-text');
    expect(textShape.attr('x')).toBe(200);
    expect(textShape.attr('y')).toBe(300);
  });

  it('update offset, offset', () => {
    text.update({
      offsetX: 20,
      offsetY: 10,
    });
    const textShape = text.getElementById('a-annotation-text');
    expect(textShape.attr('x')).toBe(text.get('x'));
    expect(textShape.attr('y')).toBe(text.get('y'));
    const matrix = text.get('group').attr('matrix');
    expect(matrix[6]).toEqual(20);
    expect(matrix[7]).toEqual(10);

    text.setOffset(0, 0);
    expect(text.get('group').attr('matrix')).toBe(null);
  });

  it('set location', () => {
    text.setLocation({ x: 300, y: 400 });
    const textShape = text.getElementById('a-annotation-text');
    expect(textShape.attr('x')).toBe(300);
    expect(textShape.attr('y')).toBe(400);
  });

  it('update style', () => {
    text.update({
      style: {
        fill: 'red',
      },
    });
    const textShape = text.getElementById('a-annotation-text');
    expect(textShape.attr('fill')).toBe('red');
  });

  it('rotate', () => {
    text.setLocation({ x: 10, y: 10 });
    text.update({
      rotate: Math.PI / 2,
    });
    const textShape = text.getElementById('a-annotation-text');
    let matrix = textShape.getMatrix();
    expect(matrix).toEqual(getMatrixByAngle({ x: 10, y: 10 }, Math.PI / 2));

    text.setLocation({ x: 100, y: 100 });
    matrix = textShape.getMatrix();
    expect(matrix).toEqual(getMatrixByAngle({ x: 100, y: 100 }, Math.PI / 2));
    text.update({
      rotate: null,
    });
    matrix = textShape.getMatrix();
    expect(matrix).toEqual(null);
  });

  it('destroy', () => {
    text.destroy();
    expect(text.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
