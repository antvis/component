import { Canvas } from '@antv/g-canvas';
import GroupComponent from '../../../src/abstract/group-component';

class BComponent extends GroupComponent {
  protected renderInner(group) {
    const showA = this.get('showA');
    if (showA) {
      const shape = this.addShape(group, {
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
      const shape = this.addShape(group, {
        type: 'rect',
        id: 'b',
        attrs: {
          x: 40,
          y: 40,
          width: 60,
          height: 20,
          fill: 'red',
        },
      });
    }
  }
}

describe('test simple component', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cgs1';
  const canvas = new Canvas({
    container: 'cgs1',
    width: 500,
    height: 500,
  });

  const container = canvas.addGroup();
  const b = new BComponent({
    id: 'b1',
    showA: true, // 通过这个属性控制生成图形
    animate: false, // 禁止动画
    container,
  });
  it('init', () => {
    expect(b.get('id')).toEqual('b1');
    expect(b.getContainer()).toBe(container);
    expect(b.get('group')).toBe(container.get('children')[0]);
  });

  it('render', () => {
    b.render();
    expect(b.getElementById('a')).not.toBe(undefined);
    expect(b.get('group').getChildren().length).toBe(1);
  });

  it('update b', () => {
    b.update({
      showB: true,
    });
    expect(b.get('group').getChildren().length).toBe(2);
    expect(
      b
        .get('group')
        .getChildren()[0]
        .get('id')
    ).toBe('a'); // 保证顺序不变
  });

  it('update a', () => {
    b.update({
      showA: false,
      showB: true,
    });
    expect(b.get('group').getChildren().length).toBe(1);
    expect(b.getElementById('a')).toBe(undefined);
    b.update({
      showB: false,
    });
    expect(b.get('group').getChildren().length).toBe(0);
    expect(b.getElementById('b')).toBe(undefined);
  });

  it('update all', () => {
    b.update({
      showA: true,
      showB: true,
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
      showB: true,
    });
    const bShape = b.getElementById('b');
    b.set('animate', true);
    b.update({
      showA: true,
      showB: false,
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
      showB: false,
    });
    expect(b.getElementById('b')).toBe(undefined);
    b.set('animate', true);
    b.update({
      showA: true,
      showB: true,
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

  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});
