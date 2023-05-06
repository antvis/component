import { BBox, Canvas, IShape } from '@antv/g-canvas';
import { Annotation } from '../../../src';
import { createDiv } from '../../util/dom';

describe('annotation data-marker', () => {
  createDiv('container');
  const canvas = new Canvas({
    container: 'container',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  const coordinateBBox: BBox = {
    x: 0,
    y: 0,
    minX: 0,
    minY: 0,
    maxX: 500,
    maxY: 500,
    width: 500,
    height: 500,
  };
  const dataMarker = new Annotation.DataMarker({
    id: 'd',
    container,
    updateAutoRender: true,
    x: 100,
    y: 150,
    text: {
      content: 'test text',
    },
  });

  it('init', () => {
    dataMarker.init();
    expect(dataMarker.get('name')).toEqual('annotation');
    expect(dataMarker.get('type')).toEqual('dataMarker');
    expect(dataMarker.getLocation()).toEqual({ x: 100, y: 150 });
  });

  it('render', () => {
    dataMarker.render();

    // group matrix
    expect(dataMarker.get('group').attr('matrix')).toEqual([1, 0, 0, 0, 1, 0, 100, 150, 1]);

    // point rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeDefined();

    // line rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeDefined();

    // text rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text')).toBe('test text');

    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.attr('x')).toBe(pointShape.attr('x'));
    expect(textGroup.attr('y')).toBeLessThan(pointShape.attr('y'));
  });

  it('render downward', () => {
    dataMarker.update({
      direction: 'downward',
    });

    // group matrix
    expect(dataMarker.get('group').attr('matrix')).toEqual([1, 0, 0, 0, 1, 0, 100, 150, 1]);

    // point rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeDefined();

    // line rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeDefined();

    // text rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text')).toBe('test text');

    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.attr('x')).toBe(pointShape.attr('x'));
    expect(textGroup.attr('y')).toBeGreaterThan(pointShape.attr('y'));
  });

  it('render leftward', () => {
    dataMarker.update({
      direction: 'leftward',
    });

    // group matrix
    expect(dataMarker.get('group').attr('matrix')).toEqual([1, 0, 0, 0, 1, 0, 100, 150, 1]);

    // point rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeDefined();

    // line rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeDefined();

    // text rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text')).toBe('test text');

    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.attr('x')).toBeLessThan(pointShape.attr('x'))
    expect(textGroup.attr('y')).toBe(pointShape.attr('y'));
  });

  it('render rightward', () => {
    dataMarker.update({
      direction: 'rightward',
    });

    // group matrix
    expect(dataMarker.get('group').attr('matrix')).toEqual([1, 0, 0, 0, 1, 0, 100, 150, 1]);

    // point rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeDefined();

    // line rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeDefined();

    // text rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text')).toBe('test text');

    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.attr('x')).toBeGreaterThan(pointShape.attr('x'))
    expect(textGroup.attr('y')).toBe(pointShape.attr('y'));
  });

  it('render styled', () => {
    dataMarker.update({
      point: {
        style: {
          stroke: '#ff0000',
        },
      },
      text: {
        content: 'test text',
        style: {
          textAlign: 'center',
        },
      },
    });
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    const textShape: IShape = dataMarker.getElementByLocalId('text');

    expect(pointShape.attr('stroke')).toBe('#ff0000');
    expect(textShape.attr('textAlign')).toBe('center');
  });

  it('render without line', () => {
    dataMarker.update({
      direction: 'upward',
      line: null,
    });

    // point rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeDefined();

    // line not rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeUndefined();

    // text rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text')).toBe('test text');
  });

  it('render without text & line', () => {
    dataMarker.update({
      direction: 'upward',
      line: null,
      text: null,
    });

    // point rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeDefined();

    // line not rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeUndefined();

    // text not rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape).toBeUndefined();
  });

  it('render without point & line', () => {
    dataMarker.update({
      direction: 'upward',
      point: null,
      line: null,
      text: {
        content: 'test text',
      },
    });

    // point not rendered
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(pointShape).toBeUndefined();

    // line not rendered
    const lineShape: IShape = dataMarker.getElementByLocalId('line');
    expect(lineShape).toBeUndefined();

    // text rendered
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text')).toBe('test text');
  });

  it('render top side beyond', () => {
    dataMarker.update({
      x: 100,
      y: 20,
      direction: 'upward',
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test text',
      },
    });
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    const textGroup = dataMarker.getElementByLocalId('text-group');

    // text should be downward
    expect(textShape.attr('text')).toBe('test text');
    expect(textGroup.getCanvasBBox().y).toBeGreaterThan(pointShape.attr('y'));
  });

  it('render right side beyond', () => {
    dataMarker.update({
      x: 480,
      y: 150,
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test text公司的发鬼地方框架',
      },
    });
    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.getCanvasBBox().maxX).toBe(500);
  });

  it('render bottom side beyond', () => {
    dataMarker.update({
      x: 100,
      y: 480,
      direction: 'downward',
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test text',
      },
    });

    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.getCanvasBBox().y).toBeLessThan(pointShape.getCanvasBBox().y);
  });

  it('render left side beyond', () => {
    dataMarker.update({
      x: 10,
      y: 150,
      direction: 'upward',
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test text',
        style: {
          textAlign: 'end',
        },
      },
    });

    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.getCanvasBBox().minX).toBe(0);
  });

  it('render left side beyond with autoAdjust', () => {
    dataMarker.update({
      x: 10,
      y: 150,
      autoAdjust: true,
      direction: 'upward',
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test text',
      },
    });

    const textGroup = dataMarker.getElementByLocalId('text-group');
    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    expect(textGroup.getCanvasBBox().x).toBeGreaterThan(pointShape.attr('x'));
  });

  it('render bottom side beyond with autoAdjust', () => {
    dataMarker.update({
      x: 100,
      y: 480,
      direction: 'downward',
      autoAdjust: true,
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test text',
      },
    });

    const pointShape: IShape = dataMarker.getElementByLocalId('point');
    const textShape: IShape = dataMarker.getElementByLocalId('text');
    expect(textShape.getCanvasBBox().y).toBeGreaterThan(pointShape.attr('y'));
  });

  it('render left side beyond, with background and auto ellipsis', () => {
    dataMarker.update({
      x: 10,
      y: 150,
      direction: 'upward',
      coordinateBBox,
      point: {},
      line: {},
      text: {
        content: 'test textkj',
        style: {
          textAlign: 'end',
        },
        maxLength: 50,
        autoEllipsis: true,
        background: {
          style: {
            fill: '#1890ff',
            fillOpacity: 0.5
          },
        }
      },
    });

    const textGroup = dataMarker.getElementByLocalId('text-group');
    expect(textGroup.getCanvasBBox().minX).toBe(0);

    const textShape = dataMarker.getElementByLocalId('text');
    expect(textShape.attr('text').indexOf('…')).toBeGreaterThan(-1);
  });

  it('destroy', () => {
    dataMarker.destroy();

    expect(container.getChildren()).toHaveLength(0);
  });
});
