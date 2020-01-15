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

  const dataRegion = new Annotation.DataRegion({
    id: 'd',
    container,
    content: 'test text',
    points: [
      { x: 100, y: 400 },
      { x: 150, y: 350 },
    ],
  });

  it('init', () => {
    expect(dataRegion.get('name')).toEqual('annotation');
    expect(dataRegion.get('type')).toEqual('dataRegion');
    expect(dataRegion.getLocation()).toEqual({
      points: [
        { x: 100, y: 400 },
        { x: 150, y: 350 },
      ],
    });
  });

  it('render', () => {
    dataRegion.render();
    const regionShape: IShape = dataRegion.getElementByLocalId('region');
    const textShape: IShape = dataRegion.getElementByLocalId('text');

    expect(regionShape.attr('path')).toEqual([
      ['M', 100, 350],
      ['L', 100, 400],
      ['L', 150, 350],
      ['L', 150, 350],
    ]);
    expect(textShape.attr('text')).toEqual('test text');
    expect(textShape.attr('textAlign')).toEqual('center');
    expect(textShape.attr('x')).toBe((100 + 150) / 2);
    expect(textShape.attr('y')).toBe(350);
  });

  it('render multiple points', () => {
    dataRegion.update({
      points: [
        { x: 100, y: 200 },
        { x: 150, y: 350 },
        { x: 200, y: 300 },
        { x: 250, y: 250 },
        { x: 300, y: 200 },
      ],
    });
    const regionShape: IShape = dataRegion.getElementByLocalId('region');
    const textShape: IShape = dataRegion.getElementByLocalId('text');

    expect(regionShape.attr('path')).toEqual([
      ['M', 100, 200],
      ['L', 100, 200],
      ['L', 150, 350],
      ['L', 200, 300],
      ['L', 250, 250],
      ['L', 300, 200],
      ['L', 300, 200],
    ]);
    expect(textShape.attr('text')).toBe('test text');
    expect(textShape.attr('x')).toBe((100 + 300) / 2);
    expect(textShape.attr('y')).toBe(200);
    expect(textShape.attr('textAlign')).toBe('center');
  });

  it('render styled', () => {
    dataRegion.update({
      style: {
        region: {
          fill: '#ff0000',
        },
        text: {
          stroke: '#00ff00',
        },
      },
    });
    const regionShape: IShape = dataRegion.getElementByLocalId('region');
    const textShape: IShape = dataRegion.getElementByLocalId('text');

    expect(regionShape.attr('fill')).toBe('#ff0000');
    expect(textShape.attr('stroke')).toBe('#00ff00');
  });

  it('destroy', () => {
    dataRegion.destroy();

    expect(container.getChildren()).toHaveLength(0);
  });
});
