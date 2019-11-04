import { Canvas } from '@antv/g-canvas';
import ImageAnnotation from '../../../src/annotation/image';

describe('test arc image', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cani';
  const canvas = new Canvas({
    container: 'cani',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const image = new ImageAnnotation({
    id: 'a',
    container,
    src: 'https://img.alicdn.com/tfs/TB1M.wKkND1gK0jSZFyXXciOVXa-120-120.png',
    start: { x: 100, y: 100 },
    end: { x: 220, y: 220 },
  });

  it('init', () => {
    expect(image.get('name')).toBe('annotation');
    expect(image.get('type')).toBe('image');
    expect(image.getLocation()).toEqual({
      start: { x: 100, y: 100 },
      end: { x: 220, y: 220 },
    });
  });

  it('render', () => {
    image.render();
    const shape = image.getElementById('a-annotation-image');
    expect(shape).not.toBe(undefined);
    expect(shape.attr('width')).toBe(120);
  });

  it('update', () => {
    image.update({
      start: { x: 200, y: 200 },
      end: { x: 50, y: 50 },
    });
    const shape = image.getElementById('a-annotation-image');
    expect(shape.attr('x')).toBe(50);
    expect(shape.attr('y')).toBe(50);
    expect(shape.attr('width')).toBe(150);
  });

  it('image src', () => {
    image.update({
      src: 'https://img.alicdn.com/tfs/TB1lf3HkKT2gK0jSZFvXXXnFXXa-234-92.png',
      start: { x: 100, y: 100 },
      end: { x: 300, y: 300 },
      style: {
        width: 100,
        height: 100,
      },
    });
    const shape = image.getElementById('a-annotation-image');
    expect(shape.attr('x')).toBe(100);
    expect(shape.attr('y')).toBe(100);
    expect(shape.attr('width')).toBe(100);
  });

  it('destroy', () => {
    image.destroy();
    expect(image.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
