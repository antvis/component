import { Canvas } from '@antv/g-canvas';
import TextAnnotation from '../../../src/annotation/text';
import { getMatrixByAngle, getMatrixByTranslate } from '../../../src/util/matrix';

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
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect((minX + maxX) / 2).toBe(100);
    expect((minY + maxY) / 2).toBe(150);
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
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect((minX + maxX) / 2).toBe(200);
    expect((minY + maxY) / 2).toBe(300);
  });

  it('update offset, offset', () => {
    text.update({
      offsetX: 20,
      offsetY: 10,
    });
    const textShape = text.getElementById('a-annotation-text');
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect((minX + maxX) / 2).toBe(text.get('x') + 20);
    expect((minY + maxY) / 2).toBe(text.get('y') + 10);

    const matrix = text.get('group').attr('matrix');
    expect(matrix[6]).toEqual(20);
    expect(matrix[7]).toEqual(10);

    text.setOffset(0, 0);
    expect(text.get('group').attr('matrix')).toBe(null);
  });

  it('set location', () => {
    text.setLocation({ x: 300, y: 400 });
    const textShape = text.getElementById('a-annotation-text');
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect((minX + maxX) / 2).toBe(300);
    expect((minY + maxY) / 2).toBe(400);
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
    text.setLocation({ x: 250, y: 250 });
    text.update({
      rotate: Math.PI / 2,
    });
    const textGroup = text.getElementById('a-annotation-text-group');
    let matrix = textGroup.getMatrix();
    expect(matrix).toEqual(getMatrixByAngle({ x: 250, y: 250 }, Math.PI / 2, getMatrixByTranslate({ x: 250, y: 250 })));

    text.setLocation({ x: 100, y: 100 });
    matrix = textGroup.getMatrix();
    expect(matrix).toEqual(getMatrixByAngle({ x: 100, y: 100 }, Math.PI / 2, getMatrixByTranslate({ x: 100, y: 100 })));
    text.update({
      rotate: null,
    });
    matrix = textGroup.getMatrix();
    expect(matrix).toEqual(getMatrixByTranslate({ x: 100, y: 100 }));
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

describe('text with background', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant1';
  const canvas = new Canvas({
    container: 'cant1',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  const text = new TextAnnotation({
    id: 'a',
    container,
    x: 100,
    y: 150,
    content: '我是一段很长很长很长很长很长很长很长的文本',
    updateAutoRender: true,
    maxLength: 60,
    background: {
      padding: 10,
      style: {
        fill: '#1890ff',
        fillOpacity: 0.2,
        radius: 5
      }
    }
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
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect(textShape.attr(text.get('content')));
    expect((minX + maxX) / 2).toBe(100);
    expect((minY + maxY) / 2).toBe(150);
    expect(textShape.get('tip')).toBe('我是一段很长很长很长很长很长很长很长的文本');
    const textBg = text.getElementById('a-annotation-text-bg');
    expect(textBg).toBeDefined();
    expect(textBg.getCanvasBBox().minX).toBe(73.3388671875);
    expect(textBg.getCanvasBBox().minY).toBeCloseTo(134);
    expect(textBg.getCanvasBBox().width).toBe(53.322265625);
    expect(textBg.getCanvasBBox().height).toBeCloseTo(32);
  });

  it('update text', () => {
    text.update({ content: 'change text' });
    expect(text.getElementById('a-annotation-text').attr('text').indexOf('…')).toBeGreaterThan(-1);
  });

  it('update offset, offset', () => {
    text.update({
      offsetX: 20,
      offsetY: 10,
    });
    const textShape = text.getElementById('a-annotation-text');
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect((minX + maxX) / 2).toBe(text.get('x') + 20);
    expect((minY + maxY) / 2).toBe(text.get('y') + 10);

    const matrix = text.get('group').attr('matrix');
    expect(matrix[6]).toEqual(20);
    expect(matrix[7]).toEqual(10);

    text.setOffset(0, 0);
    expect(text.get('group').attr('matrix')).toBe(null);
  });

  it('set location', () => {
    text.setLocation({ x: 300, y: 400 });
    const textShape = text.getElementById('a-annotation-text');
    const { minX, maxX, minY, maxY } = textShape.getCanvasBBox();
    expect((minX + maxX) / 2).toBe(300);
    expect((minY + maxY) / 2).toBe(400);
  });

  it('update style', () => {
    text.update({
      style: {
        fill: '#000',
      },
      background: {
        padding: 10,
        style: {
          fill: 'red',
          fillOpacity: 0.1,
        }
      }
    });
    const textShape = text.getElementById('a-annotation-text');
    expect(textShape.attr('fill')).toBe('#000');

    const textBg = text.getElementById('a-annotation-text-bg');
    expect(textBg.attr('fill')).toBe('red');
  });

  it('rotate', () => {
    text.setLocation({ x: 250, y: 250 });
    text.update({
      rotate: Math.PI / 2,
    });
    const textGroup = text.getElementById('a-annotation-text-group');
    let matrix = textGroup.getMatrix();
    expect(matrix).toEqual(getMatrixByAngle({ x: 250, y: 250 }, Math.PI / 2, getMatrixByTranslate({ x: 250, y: 250 })));

    text.setLocation({ x: 100, y: 100 });
    matrix = textGroup.getMatrix();
    expect(matrix).toEqual(getMatrixByAngle({ x: 100, y: 100 }, Math.PI / 2, getMatrixByTranslate({ x: 100, y: 100 })));
    text.update({
      rotate: null,
    });
    matrix = textGroup.getMatrix();
    expect(matrix).toEqual(getMatrixByTranslate({ x: 100, y: 100 }));
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

