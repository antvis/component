import { Canvas } from '@antv/g-canvas';
import { keys } from '@antv/util';
import GroupComponent from '../../../src/abstract/group-component';

class CComponent extends GroupComponent {
  protected renderInner(group) {
    const showA = this.get('showA');
    if (showA) {
      this.addShape(group, {
        type: 'text',
        id: 'a',
        attrs: {
          x: 20,
          y: 20,
          fill: 'red',
          text: 100,
        },
      });
    }
    const showB = this.get('showB');
    if (showB) {
      const bGroup = this.addGroup(group, {
        id: 'bg',
      });
      this.addShape(bGroup, {
        type: 'rect',
        id: 'b1',
        attrs: {
          x: 40,
          y: 40,
          width: 60,
          height: 20,
          fill: 'red',
        },
      });
    }
    const showC = this.get('showC');
    if (showC) {
      const cGroup = this.addGroup(group, {
        id: 'cg',
      });
      this.addShape(cGroup, {
        type: 'rect',
        id: 'c1',
        attrs: {
          x: 100,
          y: 100,
          width: 60,
          height: 20,
          fill: 'red',
        },
      });

      this.addShape(cGroup, {
        type: 'rect',
        id: 'c2',
        attrs: {
          x: 120,
          y: 120,
          width: 60,
          height: 20,
          fill: 'blue',
        },
      });
    }
  }
}

describe('test complex component', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cg1';
  const canvas = new Canvas({
    container: 'cg1',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const c = new CComponent({
    id: 'c1',
    showA: true, // 通过这个属性控制生成图形
    animate: false, // 禁止动画
    container,
  });
  const group = c.get('group');
  it('init', () => {
    expect(container.getChildren().length).toBe(1);
    expect(group.getChildren().length).toBe(0);
    expect(c.getElementById('a')).toBe(undefined);
  });

  it('render', () => {
    c.render();
    expect(group.getChildren().length).toBe(1);
    expect(c.getElementById('a')).not.toBe(undefined);
  });

  it('update b', () => {
    c.update({
      showA: true,
      showB: true,
      showC: false,
    });
    expect(group.getChildren().length).toBe(2);
    expect(c.getElementById('bg')).not.toBe(undefined);
    expect(c.getElementById('bg').getChildren().length).toBe(1);
    expect(c.getElementById('b1')).not.toBe(undefined);
  });
  it('update c', () => {
    c.update({
      showA: true,
      showB: true,
      showC: true,
    });
    expect(group.getChildren().length).toBe(3);
    expect(c.getElementById('cg')).not.toBe(undefined);
    expect(keys(c.get('shapesMap')).length).toEqual(6);
    expect(c.getElementById('c1')).not.toBe(undefined);
    expect(c.getElementById('c2')).not.toBe(undefined);
  });
  it('update a, b', () => {
    c.update({
      showA: false,
      showB: true,
      showC: true,
    });
    expect(c.getElementById('a')).toBe(undefined);
    expect(group.getChildren().length).toBe(2);
    expect(group.getChildren()[0].get('id')).toBe('bg');
    expect(keys(c.get('shapesMap')).length).toEqual(5);
    c.update({
      showB: false,
    });
    expect(group.getChildren().length).toBe(1);
    expect(keys(c.get('shapesMap')).length).toEqual(3);

    c.update({
      showA: true,
    });
    expect(c.getElementById('a')).not.toBe(undefined);
    expect(group.getChildren().length).toBe(2);
    expect(keys(c.get('shapesMap')).length).toEqual(4);
    expect(group.getChildren()[0].get('id')).toBe('a');
    c.update({
      showA: false,
      showC: false,
    });
    expect(group.getChildren().length).toBe(0);
    expect(keys(c.get('shapesMap')).length).toEqual(0);
  });
  it('update All', () => {
    c.update({
      showA: true,
      showB: true,
      showC: true,
    });
    expect(group.getChildren().length).toBe(3);
    expect(keys(c.get('shapesMap')).length).toEqual(6);
  });
  it('clear', () => {
    c.clear();
    expect(group.getChildren().length).toBe(0);
    expect(keys(c.get('shapesMap')).length).toEqual(0);
  });

  it('rerender', () => {
    c.set('showA', true);
    c.set('showB', true);
    c.set('showC', true);
    c.render();
    expect(group.getChildren().length).toBe(3);
    expect(keys(c.get('shapesMap')).length).toEqual(6);
  });

  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});
