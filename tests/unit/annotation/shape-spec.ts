import { IGroup } from '@antv/g-base';
import { Canvas } from '@antv/g-canvas';
import ShapeAnnotation from '../../../src/annotation/shape';

describe('custom annotation /w shape', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant';
  const canvas = new Canvas({
    container: 'cant',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  const shapeCustom = new ShapeAnnotation({
    id: 's',
    container,
    render: (group) => {
      group.addShape('text', {
        id: 'my-text',
        attrs: {
          text: `shape test`,
          x: 100,
          y: 150,
        },
      });
    },
  });

  it('init', () => {
    shapeCustom.init();
    expect(shapeCustom.get('name')).toEqual('annotation');
    expect(shapeCustom.get('type')).toBe('shape');
  });

  it('render', () => {
    shapeCustom.render();
    const group: IGroup = shapeCustom.get('group');
    expect(group.getChildren()).toHaveLength(1);
    const shape = group.getChildByIndex(0);
    expect(shape.get('type')).toBe('text');
    expect(shape.attr('text')).toBe('shape test');
    expect(shape.attr('x')).toBe(100);
    expect(shape.attr('y')).toBe(150);
  });

  it('update', () => {
    shapeCustom.update({
      render: (group) => {
        group.addShape('text', {
          id: 'my-text',
          attrs: {
            text: 'shape test 2',
            x: 200,
            y: 250,
          },
        });
      },
    });
    shapeCustom.render();
    const group: IGroup = shapeCustom.get('group');
    expect(group.getChildren()).toHaveLength(1);
    const shape = group.getChildByIndex(0);
    expect(shape.get('type')).toBe('text');
    expect(shape.attr('text')).toBe('shape test 2');
    expect(shape.attr('x')).toBe(200);
    expect(shape.attr('y')).toBe(250);
  });

  it('destroy', () => {
    shapeCustom.destroy();
    expect(shapeCustom.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});

describe('custom annotation /w group', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant';
  const canvas = new Canvas({
    container: 'cant',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  const groupCustom = new ShapeAnnotation({
    id: 's',
    container,
    render: (group) => {
      const parent = group.addGroup();
      parent.addShape('line', {
        id: 'my-line',
        attrs: {
          x1: 100,
          y1: 200,
          x2: 150,
          y2: 250,
          stroke: 'red',
        },
      });
      parent.addShape('text', {
        id: 'my-text',
        attrs: {
          text: 'line',
          x: 125,
          y: 225,
        },
      });
    },
  });

  it('init', () => {
    groupCustom.init();
    expect(groupCustom.get('name')).toEqual('annotation');
    expect(groupCustom.get('type')).toBe('shape');
  });

  it('render', () => {
    groupCustom.render();
    const group: IGroup = groupCustom.get('group');
    expect(group.getChildren()).toHaveLength(1);
    const parent = group.getChildByIndex(0) as IGroup;
    expect(parent.getChildren()).toHaveLength(2);
    const line = parent.getChildByIndex(0);
    const text = parent.getChildByIndex(1);
    expect(line.get('type')).toBe('line');
    expect(line.attr('x1')).toBe(100);
    expect(line.attr('y1')).toBe(200);
    expect(line.attr('x2')).toBe(150);
    expect(line.attr('y2')).toBe(250);
    expect(line.attr('stroke')).toBe('red');
    expect(text.get('type')).toBe('text');
    expect(text.attr('text')).toBe('line');
    expect(text.attr('x')).toBe(125);
    expect(text.attr('y')).toBe(225);
  });

  it('update', () => {
    groupCustom.update({
      render: (group) => {
        const parent = group.addGroup();
        parent.addShape('line', {
          id: 'my-line',
          attrs: {
            x1: 200,
            y1: 300,
            x2: 250,
            y2: 350,
            stroke: 'yellow',
          },
        });
        parent.addShape('text', {
          id: 'my-text',
          attrs: {
            text: 'line 2',
            x: 225,
            y: 325,
          },
        });
      },
    });
    groupCustom.render();
    const group: IGroup = groupCustom.get('group');
    expect(group.getChildren()).toHaveLength(1);
    const parent = group.getChildByIndex(0) as IGroup;
    expect(parent.getChildren()).toHaveLength(2);
    const line = parent.getChildByIndex(0);
    const text = parent.getChildByIndex(1);
    expect(line.get('type')).toBe('line');
    expect(line.attr('x1')).toBe(200);
    expect(line.attr('y1')).toBe(300);
    expect(line.attr('x2')).toBe(250);
    expect(line.attr('y2')).toBe(350);
    expect(line.attr('stroke')).toBe('yellow');
    expect(text.get('type')).toBe('text');
    expect(text.attr('text')).toBe('line 2');
    expect(text.attr('x')).toBe(225);
    expect(text.attr('y')).toBe(325);
  });

  it('destroy', () => {
    groupCustom.destroy();
    expect(groupCustom.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
