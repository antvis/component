import { Canvas } from '@antv/g-canvas';
import { getBBoxWithClip, updateClip } from '../../src/util/util';

describe('test group util', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 500,
    height: 500,
  });
  
  const group = canvas.addGroup();
  const shape1 = group.addShape('circle', {
    attrs: {
      x: 100,
      y: 100,
      r: 10,
      fill: 'red'
    }
  });
  shape1.setClip({
    type: 'rect',
    attrs: {
      x: 80,
      y: 80,
      width: 20,
      height: 20
    }
  });
  const subGroup = group.addGroup();
  subGroup.setClip({
    type: 'rect',
    attrs: {
      x: 0,
      y: 0,
      width: 50,
      height: 50
    }
  });
  const shape2 = subGroup.addShape({
    type: 'rect',
    attrs: {
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      fill: 'blue'
    }
  });

  it('shape bbox', () => {
    const bbox = getBBoxWithClip(shape1);
    expect(bbox.x).toBe(90);
    expect(bbox.y).toBe(90);
    expect(bbox.width).toBe(10);
    expect(bbox.height).toBe(10);
  });

  it('group box', () => {
    const bbox = getBBoxWithClip(subGroup);
    expect(bbox.x).toBe(20);
    expect(bbox.y).toBe(20);
    expect(bbox.width).toBe(30);
    expect(bbox.height).toBe(30);
  });

  it('top group', () => {
    const bbox = getBBoxWithClip(group);
    expect(bbox.x).toBe(20);
    expect(bbox.y).toBe(20);
    expect(bbox.width).toBe(80);
    expect(bbox.height).toBe(80);
  });

  it('copy clip', () => {
    const group1 = canvas.addGroup();
    updateClip(group1, group); // all no clip
    expect(group1.getClip()).toBe(null);
    updateClip(group1, subGroup); // one had group
    expect(group1.getClip().attr()).toEqual(subGroup.getClip().attr());

    group1.setClip(null);
    updateClip(subGroup, group1);
    expect(subGroup.getClip()).toEqual(null);

    subGroup.setClip({
      type: 'rect',
      attrs: {
        x: 0,
        y: 0,
        width: 50,
        height: 50
      }
    });

    group1.setClip({
      type: 'circle',
      attrs: {
        x: 0,
        y: 0,
        r: 10
      }
    });
    updateClip(group1, subGroup);
    expect(group1.getClip().attr()).toEqual(subGroup.getClip().attr());
  });
})