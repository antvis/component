import { Canvas, IGroup } from '@antv/g-canvas';
import { each } from '@antv/util';
import { Annotation } from '../../../src';
import { regionToBBox } from '../../../src/util/util';
import { createDiv } from '../../util/dom';

describe('annotation data-marker', () => {
  createDiv('container');
  const canvas = new Canvas({
    container: 'container',
    width: 500,
    height: 500,
  });
  const parent = canvas.addGroup();
  const container = parent.addGroup();
  const shapes = [];

  for (let i = 0; i < 50; i++) {
    shapes.push(
      parent.addShape({
        type: 'circle',
        attrs: {
          stroke: '#000000',
          fill: '#ffffff',
          r: Math.random() * 4 + 2,
          x: 500 * Math.random(),
          y: 500 * Math.random(),
        },
      })
    );
  }

  const regionFilter = new Annotation.RegionFilter({
    id: 'd',
    container,
    start: { x: 100, y: 100 },
    end: { x: 300, y: 300 },
    updateAutoRender: true,
    shapes,
    color: '#ff0000',
  });

  it('init', () => {
    expect(regionFilter.get('name')).toEqual('annotation');
    expect(regionFilter.get('type')).toEqual('regionFilter');
    expect(regionFilter.getLocation()).toEqual({
      start: { x: 100, y: 100 },
      end: { x: 300, y: 300 },
    });
  });

  it('render', () => {
    regionFilter.render();

    const bbox = regionToBBox({ start: { x: 100, y: 100 }, end: { x: 300, y: 300 } });
    const layer: IGroup = regionFilter.getElementByLocalId('region-filter');
    const children = layer.getChildren();
    const clip = layer.getClip();

    each(shapes, (shape) => {
      expect(shape.attr('stroke')).toBe('#000000');
    });

    expect(children).toHaveLength(shapes.length);
    each(children, (child) => {
      expect(child.get('type')).toBe('circle');
      expect(child.attr('stroke')).toBe('#ff0000');
    });
    expect(clip.get('type')).toEqual('rect');
    expect(clip.attr('x')).toBe(bbox.minX);
    expect(clip.attr('y')).toBe(bbox.minY);
    expect(clip.attr('width')).toBe(bbox.width);
    expect(clip.attr('height')).toBe(bbox.height);
  });

  it('update', () => {
    const start = { x: 200, y: 200 };
    const end = { x: 400, y: 400 };
    regionFilter.update({
      color: '#00ff00',
      start,
      end,
    });

    const bbox = regionToBBox({ start, end });
    const layer: IGroup = regionFilter.getElementByLocalId('region-filter');
    const children = layer.getChildren();
    const clip = layer.getClip();

    each(shapes, (shape) => {
      expect(shape.attr('stroke')).toBe('#000000');
    });

    expect(children).toHaveLength(shapes.length);
    each(children, (child) => {
      expect(child.get('type')).toBe('circle');
      expect(child.attr('stroke')).toBe('#00ff00');
    });
    expect(clip.get('type')).toEqual('rect');
    expect(clip.attr('x')).toBe(bbox.minX);
    expect(clip.attr('y')).toBe(bbox.minY);
    expect(clip.attr('width')).toBe(bbox.width);
    expect(clip.attr('height')).toBe(bbox.height);
  });

  it('destroy', () => {
    regionFilter.destroy();

    expect(container.getChildren()).toHaveLength(0);
  });
});
