import { Canvas } from '@antv/g-canvas';
import LineAnnotation from '../../../src/annotation/line';
import { getMatrixByAngle, getMatrixByTranslate } from '../../../src/util/matrix';

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
    style: {
      stroke: '#000'
    }
  });

  it('init', () => {
    line.init();
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

    const textGroup = line.getElementById('l-annotation-line-text-group');
    expect(textGroup.attr('x')).toBe(50);
    expect(textGroup.attr('y')).toBe(50);

    line.update({
      text: {
        content: 'line text',
        autoRotate: true,
      },
    });
    const m = getMatrixByAngle({ x: 50, y: 50 }, Math.PI / 4, getMatrixByTranslate({x: 50, y: 50}));
    expect(textGroup.attr('matrix')).toEqual(m);
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
    const textGroup = line.getElementById('l-annotation-line-text-group');
    expect(textGroup.attr('x')).toBe(0);
    expect(textGroup.attr('y')).toBe(0);

    line.update({
      text: {
        position: 'end',
        content: 'line text',
        autoRotate: false,
      },
    });
    expect(textGroup.attr('x')).toBe(100);
    expect(textGroup.attr('y')).toBe(100);

    line.update({
      text: {
        position: '40%',
        content: 'line text',
        autoRotate: false,
      },
    });
    expect(textGroup.attr('x')).toBe(40);
    expect(textGroup.attr('y')).toBe(40);
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

describe('test line annotation with text enhancement', () => {
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
    style: {
      stroke: '#000',
      lineWidth: 2,
    },
    text: {
      content: 'line text 123123243434',
      autoRotate: false,
      background: {
        padding: 5,
        style: {
          fill: '#1890ff',
          fillOpacity: 0.5,
        }
      },
      maxLength: 100,
      autoEllipsis: true,
    },
  });

  line.init();
  line.render();

  it('text auto ellipis', () => {
    const textShape = line.getElementById('l-annotation-line-text');
    expect(textShape.attr('text').indexOf('…')).toBeGreaterThan(-1);
    expect(textShape.get('tip')).toBe('line text 123123243434');
    expect(textShape.getBBox().width + 10).toBeLessThan(100);

    const textBgShape = line.getElementById('l-annotation-line-text-bg');
    expect(textBgShape).toBeDefined();
  });

  it('text, autoRotate', () => {
    line.update({
      text: {
        content: 'line text 123123243434',
        autoRotate: true,
        maxLength: 100,
        autoEllipsis: true,
      }
    });
    const textShape = line.getElementById('l-annotation-line-text');
    expect(textShape.attr('text').indexOf('…')).toBeGreaterThan(-1);
    expect(textShape.get('tip')).toBe('line text 123123243434');
    expect(textShape.getBBox().width + 10).toBeLessThan(100);

    const textBgShape = line.getElementById('l-annotation-line-text-bg');
    expect(textBgShape).toBeUndefined();
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
