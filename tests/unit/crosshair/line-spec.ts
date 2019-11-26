import { Canvas } from '@antv/g-canvas';
import LineCrosshair from '../../../src/crosshair/line';
import { getMatrixByAngle } from '../../../src/util/matrix';
describe('test line crosshair', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'crosshair-line';
  const canvas = new Canvas({
    container: 'crosshair-line',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const crosshair = new LineCrosshair({
    container,
    id: 'c',
    start: { x: 100, y: 100 },
    end: { x: 400, y: 100 },
  });

  it('init', () => {
    expect(crosshair.get('name')).toBe('crosshair');
    expect(crosshair.get('type')).toBe('line');
  });

  it('render', () => {
    crosshair.render();
    expect(crosshair.getElementById('c-crosshair-line')).not.toBe(undefined);
    expect(crosshair.getElementById('c-crosshair-text')).toBe(undefined);
  });

  it('update line', () => {
    crosshair.update({
      line: {
        style: { lineDash: [2, 2] },
      },
    });
    expect(crosshair.getElementById('c-crosshair-line').attr('lineDash')).toEqual([2, 2]);
    crosshair.update({
      line: null,
    });
    expect(crosshair.getElementById('c-crosshair-line')).toBe(undefined);
    crosshair.update({
      line: {
        style: {
          stroke: 'red',
        },
      },
    });
    expect(crosshair.getElementById('c-crosshair-line').attr('stroke')).toBe('red');
  });

  it('update location', () => {
    crosshair.update({
      start: {
        x: 200,
        y: 200,
      },
    });
    expect(crosshair.getElementById('c-crosshair-line').attr('path')[0]).toEqual(['M', 200, 200]);
    crosshair.setLocation({
      end: {
        x: 400,
        y: 200,
      },
    });
    expect(crosshair.getElementById('c-crosshair-line').attr('path')[1]).toEqual(['L', 400, 200]);
  });

  it('update text', () => {
    crosshair.update({
      start: { x: 100, y: 100 },
      end: { x: 400, y: 100 },
      text: {
        offset: 20,
        content: '123',
      },
    });
    const textShape = crosshair.getElementById('c-crosshair-text');
    expect(textShape.attr('text')).toBe('123');
    expect(textShape.attr('x')).toBe(100 - 20);
    expect(crosshair.getElementById('c-crosshair-text-background')).not.toBe(undefined);
  });

  it('update text roate', () => {
    crosshair.update({
      start: { x: 100, y: 100 },
      end: { x: 400, y: 100 },
      text: {
        offset: 10,
        position: 'end',
        autoRotate: true,
        content: '123',
      },
    });

    const textShape = crosshair.getElementById('c-crosshair-text');
    expect(textShape.attr('matrix')).toEqual(getMatrixByAngle({ x: 410, y: 100 }, Math.PI / 2));
  });

  it('update text background', () => {
    crosshair.update({
      text: {
        offset: 10,
        autoRotate: true,
        content: '233',
      },
      textBackground: {
        padding: [4, 10],
        style: {
          fill: 'red',
          stroke: null,
        },
      },
    });
    const textShape = crosshair.getElementById('c-crosshair-text');
    const backShape = crosshair.getElementById('c-crosshair-text-background');
    const textBBox = textShape.getBBox();
    const backBBox = backShape.getBBox();
    expect(textBBox.width + 20).toBe(backBBox.width); // 边框
    expect(textBBox.height + 8).toBe(backBBox.height); // 边框
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
