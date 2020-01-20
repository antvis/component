import { Canvas } from '@antv/g-canvas';
import CircleCrosshair from '../../../src/crosshair/circle';
import { getMatrixByAngle } from '../../../src/util/matrix';

describe('test circle crosshair', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'crosshair-circle';
  const canvas = new Canvas({
    container: 'crosshair-circle',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const crosshair = new CircleCrosshair({
    container,
    id: 'c',
    center: { x: 200, y: 200 },
    updateAutoRender: true,
    radius: 150,
  });

  it('init', () => {
    expect(crosshair.get('name')).toBe('crosshair');
    expect(crosshair.get('type')).toBe('circle');
  });

  it('render', () => {
    crosshair.render();
    expect(crosshair.getElementById('c-crosshair-line')).not.toBe(undefined);
    expect(crosshair.getElementById('c-crosshair-text')).toBe(undefined);
  });

  it('update location', () => {
    crosshair.update({
      radius: 100,
    });
    const lineShape = crosshair.getElementById('c-crosshair-line');
    expect(lineShape.attr('path')[0]).toEqual(['M', 200, 100]);
    expect(lineShape.attr('path').length).toBe(4);
    crosshair.setLocation({
      center: { x: 100, y: 100 },
    });
    expect(lineShape.attr('path')[0]).toEqual(['M', 100, 0]);
  });

  it('udpate angle', () => {
    crosshair.update({
      radius: 100,
      center: { x: 200, y: 200 },
    });
    expect(crosshair.get('endAngle') - crosshair.get('startAngle')).toBe(Math.PI * 2);
    crosshair.update({
      startAngle: 0,
    });
    const lineShape = crosshair.getElementById('c-crosshair-line');
    expect(lineShape.attr('path')[0]).toEqual(['M', 300, 200]);
    expect(lineShape.attr('path').length).toBe(2);
    crosshair.update({
      startAngle: -Math.PI / 2,
    });
    expect(lineShape.attr('path').length).toBe(4);
  });

  it('update text', () => {
    crosshair.update({
      radius: 100,
      center: { x: 200, y: 200 },
      text: {
        offset: 10,
        content: 'circle',
      },
    });
    const textShape = crosshair.getElementById('c-crosshair-text');
    expect(textShape.attr('x')).toBe(190);
    expect(textShape.attr('y')).toBe(100);
    crosshair.update({
      text: {
        position: 'end',
        content: 0,
      },
    });
    expect(textShape.attr('text')).toBe(0);

    crosshair.update({
      startAngle: 0,
      text: {
        position: 'start',
        offset: 10,
        content: '123',
      },
    });
    expect(textShape.attr('x')).toBe(300);
    expect(textShape.attr('y')).toBe(190);
  });

  it('update text roate', () => {
    crosshair.update({
      radius: 100,
      startAngle: -Math.PI / 2,
      center: { x: 200, y: 200 },
      text: {
        offset: 10,
        autoRotate: true,
        content: 'circle',
      },
    });
    const textShape = crosshair.getElementById('c-crosshair-text');
    expect(textShape.attr('matrix')).toBe(null);
    expect(textShape.attr('x')).toBe(190);
    crosshair.update({
      startAngle: 0,
    });

    expect(textShape.attr('y')).toBe(190);
    expect(textShape.attr('matrix')).toEqual(getMatrixByAngle({ x: 300, y: 190 }, Math.PI / 2));
    crosshair.update({
      endAngle: Math.PI,
      text: {
        offset: 10,
        autoRotate: true,
        position: 'end',
        content: 'circle',
      },
    });
    expect(textShape.attr('y')).toBe(190);
  });

  it('update text background', () => {
    crosshair.update({
      radius: 100,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
      center: { x: 200, y: 200 },
      text: {
        offset: 10,
        autoRotate: false,
        content: 'circle',
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

  it('close textBackground', () => {
    crosshair.update({
      radius: 100,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
      center: { x: 200, y: 200 },
      text: {
        offset: 10,
        autoRotate: false,
        content: 'circle',
      },
      textBackground: null,
    });
    const backShape = crosshair.getElementById('c-crosshair-text-background');
    expect(backShape).toBeUndefined();
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
