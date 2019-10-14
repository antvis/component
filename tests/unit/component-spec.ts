
import Component from '../../src/abstract/component';
import GroupComponent from '../../src/abstract/group-component';
import {Canvas} from '@antv/g-canvas';
import {mix, keys} from '@antv/util';

describe('abastract component', () => {
  class AComponent extends Component {
    getDefaultCfg() {
      return {
        ...super.getDefaultCfg(),
        a: null,
        b: null,
        defaultCfg: {
          a: {
            a1: 'a1',
            a2: 'a2'
          },
          b: {
            b1: 'b1',
            b2: 'b2'
          }
        }
      };
    }
  }

  const a = new AComponent({
    id: 'a',
    a: {
      a1: '123'
    }
  });

  test('init', () => {
    expect(a.get('id')).toEqual('a');
    expect(a.get('b')).toEqual(null);
    expect(a.get('a')).toEqual({
      a1: '123',
      a2: 'a2'
    });
  });

  test('update', () => {
    a.update({
      a: {
        a2: '234'
      },
      b: {
        b2: '222'
      }
    });
    expect(a.get('a')).toEqual({
      a1: 'a1',
      a2: '234'
    });
    expect(a.get('b')).toEqual({
      b1: 'b1',
      b2: '222'
    });
  });

  test('destroy', () => {
    a.destroy();
    expect(a.destroyed).toEqual(true);
    expect(a.get('a')).toEqual(undefined);
  });
});

describe('abstract group-component', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cg1';
  const canvas = new Canvas({
    container: 'cg1',
    width: 500,
    height: 500
  });
  
  describe('test simple component', () => {
    // 简单图形对象
    class BComponent extends GroupComponent{
      renderInner(group) {
        const showA = this.get('showA');
        if (showA) {
          const shape = this.addShape(group, {
            type: 'text',
            id: 'a',
            attrs: {
              x: 20,
              y: 20,
              fill: 'red',
              text: 100
            }
          });
        }
        const showB = this.get('showB');
        if (showB) {
          const shape = this.addShape(group, {
            type: 'rect',
            id: 'b',
            attrs: {
              x: 40,
              y: 40,
              width: 60,
              height: 20,
              fill: 'red'
            }
          });
        }
      }
    }
    const container = canvas.addGroup();
    const b = new BComponent({
      id: 'b1',
      showA: true, // 通过这个属性控制生成图形
      animate: false, // 禁止动画
      container: container
    });
    it('init', () => {
      expect(b.get('id')).toEqual('b1');
      expect(b.get('group')).toBe(container.get('children')[0]);
    });

    it('render', () => {
      b.render();
      expect(b.getElementById('a')).not.toBe(undefined);
      expect(b.get('group').getChildren().length).toBe(1);
    });

    it('update b', () => {
      b.update({
        showB: true
      });
      expect(b.get('group').getChildren().length).toBe(2);
      expect(b.get('group').getChildren()[0].get('id')).toBe('a'); // 保证顺序不变
    });

    it('update a', () => {
      b.update({
        showA: false,
        showB: true
      });
      expect(b.get('group').getChildren().length).toBe(1);
      expect(b.getElementById('a')).toBe(undefined);
      b.update({
        showB: false
      });
      expect(b.get('group').getChildren().length).toBe(0);
      expect(b.getElementById('b')).toBe(undefined);
    });

    it('update all', () => {
      b.update({
        showA: true,
        showB: true
      });
      expect(b.get('group').getChildren().length).toBe(2);
      expect(b.getElementById('a')).not.toBe(undefined);
    });

    it('clear', () => {
      b.clear();
      expect(b.getElementById('a')).toBe(undefined);
      expect(b.getElementById('b')).toBe(undefined);
      expect(b.get('group').getChildren().length).toBe(0);
    });
    it('rerender', () => {
      b.set('showA', true);
      b.set('showB', true);
      b.render();
      expect(b.getElementById('a')).not.toBe(undefined);
      expect(b.getElementById('b')).not.toBe(undefined);
      expect(b.get('group').getChildren().length).toBe(2);
    });
    it('show and hide', () => {
      b.hide();
      expect(b.get('group').get('visible')).toBe(false);
      b.show();
      expect(b.get('group').get('visible')).toBe(true);
    });
    it('remove animate', (done) => {
      b.update({
        showA: true,
        showB: true
      });
      const bShape = b.getElementById('b');
      b.set('animate', true);
      b.update({
        showA: true,
        showB: false
      });
      // 执行动画时图形不会移除，但是已经在 map 中移除
      expect(b.getElementById('b')).toBe(undefined);
      expect(bShape.destroyed).toBe(false);
      expect(b.get('group').getChildren().length).toBe(2);
      setTimeout(() => {
        expect(bShape.destroyed).toBe(true);
        expect(b.get('group').getChildren().length).toBe(1);
        done();
      }, 500);
    });

    it('add Animate', (done) => {
      b.set('animate', false);
      // 先设置 showB: false
      b.update({
        showA: true,
        showB: false
      });
      expect(b.getElementById('b')).toBe(undefined);
      b.set('animate', true);
      b.update({
        showA: true,
        showB: true
      });
      const bShape = b.getElementById('b');
      expect(bShape.attr('opacity')).toBe(0);
      setTimeout(() => {
        expect(bShape.attr('opacity')).toBe(undefined);
        done();
      }, 500);
    });

    it('destroy', () => {
      b.destroy();
      expect(b.destroyed).toBe(true);
      expect(b.get('group')).toBe(undefined);
    });
  });

  describe('test complex component', () => {
    class CComponent extends GroupComponent{
      renderInner(group) {
        const showA = this.get('showA');
        if (showA) {
          const shape = this.addShape(group, {
            type: 'text',
            id: 'a',
            attrs: {
              x: 20,
              y: 20,
              fill: 'red',
              text: 100
            }
          });
        }
        const showB = this.get('showB');
        if (showB) {
          const bGroup = this.addGroup(group, {
            id: 'bg'
          });
          const shape = this.addShape(bGroup, {
            type: 'rect',
            id: 'b1',
            attrs: {
              x: 40,
              y: 40,
              width: 60,
              height: 20,
              fill: 'red'
            }
          });
        }
        const showC = this.get('showC');
        if (showC) {
          const cGroup = this.addGroup(group, {
            id: 'cg'
          });
          const shape1 = this.addShape(cGroup, {
            type: 'rect',
            id: 'c1',
            attrs: {
              x: 100,
              y: 100,
              width: 60,
              height: 20,
              fill: 'red'
            }
          });

          const shape2 = this.addShape(cGroup, {
            type: 'rect',
            id: 'c2',
            attrs: {
              x: 120,
              y: 120,
              width: 60,
              height: 20,
              fill: 'blue'
            }
          });
        }
      }
    }
    const container = canvas.addGroup();
    const c = new CComponent({
      id: 'c1',
      showA: true, // 通过这个属性控制生成图形
      animate: false, // 禁止动画
      container: container
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
        showC: false
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
        showC: true
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
        showC: true
      });
      expect(c.getElementById('a')).toBe(undefined);
      expect(group.getChildren().length).toBe(2);
      expect(group.getChildren()[0].get('id')).toBe('bg');
      expect(keys(c.get('shapesMap')).length).toEqual(5);
      c.update({
        showB: false
      });
      expect(group.getChildren().length).toBe(1);
      expect(keys(c.get('shapesMap')).length).toEqual(3);

      c.update({
        showA: true
      });
      expect(c.getElementById('a')).not.toBe(undefined);
      expect(group.getChildren().length).toBe(2);
      expect(keys(c.get('shapesMap')).length).toEqual(4);
      expect(group.getChildren()[0].get('id')).toBe('a');
      c.update({
        showA: false,
        showC: false
      });
      expect(group.getChildren().length).toBe(0);
      expect(keys(c.get('shapesMap')).length).toEqual(0);
    });
    it('update All', () => {
      c.update({
        showA: true,
        showB: true,
        showC: true
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
  });
  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});