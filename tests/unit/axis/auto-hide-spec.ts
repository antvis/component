import { Canvas } from '@antv/g-canvas';
import * as HideUtil from '../../../src/axis/overlap/auto-hide';
import { getMatrixByAngle } from '../../../src/util/matrix';

describe('test auto hide', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cah';
  const canvas = new Canvas({
    container: 'cah',
    width: 500,
    height: 500,
  });
  const group = canvas.addGroup();
  const labels = ['123', '12', '2344', '13455222', '2345', '2333', '222', '2222', '11', '33'];
  function addLabels(dx, dy, angle?) {
    group.clear();
    labels.forEach((label, index) => {
      const x = 100 + dx * index;
      const y = 100 + dy * index;
      const shape = group.addShape({
        type: 'text',
        attrs: {
          x,
          y,
          text: label,
          fill: 'red',
        },
      });
      if (angle) {
        const matrix = getMatrixByAngle({ x, y }, angle);
        shape.attr('matrix', matrix);
      }
    });
  }

  function getChildren(container) {
    const children = container.getChildren();
    return children.filter((shape) => shape.get('visible'));
  }

  function getCount(container) {
    const children = container.getChildren();
    let count = 0;
    children.forEach((shape) => {
      if (shape.get('visible')) {
        count++;
      }
    });
    return count;
  }

  function getLast(container) {
    const children = container.getChildren();
    const count = children.length;
    let last;
    for (let i = count - 1; i >= 0; i--) {
      if (children[i].get('visible')) {
        last = children[i];
        break;
      }
    }
    return last;
  }

  function getFirst(container) {
    const children = container.getChildren();
    const count = children.length;
    let first;
    for (let i = 0; i < count; i++) {
      if (children[i].get('visible')) {
        first = children[i];
        break;
      }
    }
    return first;
  }

  it('reserve first, vertical, no rotate', () => {
    HideUtil.reserveFirst(true, group, 0); // empty
    // 足够高度的文本
    addLabels(0, 20);
    HideUtil.reserveFirst(true, group, 50);
    expect(getCount(group)).toBe(labels.length - 1); // 13455222 超出限制

    // 不会存在超出限制
    addLabels(0, 20);
    HideUtil.reserveFirst(true, group, 60);
    expect(getCount(group)).toBe(labels.length);

    // 没有足够的高度，纵向会重叠
    addLabels(0, 10);
    HideUtil.reserveFirst(true, group, 60); // 仅仅去除高度上重叠的
    expect(getFirst(group).attr('text')).toBe(labels[0]);
    expect(getCount(group)).toBe(Math.round(labels.length / 2)); // 剩余一半
  });

  it('reserve first, vertical, width rotate', () => {
    addLabels(0, 20, -Math.PI / 4); // 文本旋转
    HideUtil.reserveFirst(true, group, 50); // 留出足够的空间，旋转后可以放开
    expect(group.getChildren().length).toBe(labels.length);

    addLabels(0, 20, -Math.PI / 4); // 文本旋转
    HideUtil.reserveFirst(true, group, 40); // 最长的被去除
    expect(getCount(group)).toBe(labels.length - 1);

    addLabels(0, 10, -Math.PI / 4);
    HideUtil.reserveFirst(true, group, 40); // 最长的被去除
    expect(getCount(group)).toBe(Math.round(labels.length / 2)); // 剩余一半

    addLabels(0, 10, -Math.PI / 4);
    HideUtil.reserveFirst(true, group, 20); // 留下很小的长度
    expect(getCount(group)).toBe(2);
  });

  it('reserve first, horizontal, no rotate', () => {
    addLabels(40, 0); // 不旋转的文本
    HideUtil.reserveFirst(false, group, 20);
    expect(getCount(group)).toBe(labels.length - 1);

    addLabels(25, 0);
    HideUtil.reserveFirst(false, group, 20);
    expect(getCount(group)).toBe(labels.length - 3);

    addLabels(60, 0); // 没有遮挡
    HideUtil.reserveFirst(false, group, 20);
    expect(getCount(group)).toBe(labels.length);
  });

  it('reserve first, horizontal, with rotate', () => {
    addLabels(40, 0, Math.PI / 4);
    HideUtil.reserveFirst(false, group, 30); // 限制高度，部分旋转的会超出这个高度
    expect(getCount(group)).toBe(labels.length - 1);

    addLabels(10, 0, Math.PI / 4); // 非常密集
    HideUtil.reserveFirst(false, group, 50); // 不超出限制
    expect(getCount(group)).toBe(Math.round(labels.length / 2)); // 剩余一半
    expect(getFirst(group).attr('text')).toBe(labels[0]); // 保留第一个
  });

  it('reserve last, vertical', () => {
    addLabels(0, 10); // 没有足够的高度
    HideUtil.reserveLast(true, group, 60); // 不处理超出限制的
    expect(getFirst(group).attr('text')).not.toBe(labels[0]); // 保留第一个
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);

    addLabels(30, 0);
    HideUtil.reserveLast(false, group, 30);
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('reserve both', () => {
    addLabels(0, 10); // 没有足够的高度
    HideUtil.reserveBoth(true, group, 60);
    expect(getCount(group)).toBe(Math.ceil(labels.length / 2)); // 剩余一半
    expect(getFirst(group).attr('text')).toBe(labels[0]); //
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('equal distance, vertical', () => {
    HideUtil.equidistance(true, group);
    addLabels(0, 5);
    HideUtil.equidistance(true, group);
    const children = getChildren(group);
    expect(children.length).toBe(4);
    children.forEach((label, index) => {
      expect(label.attr('text')).toBe(labels[index * 3]);
    });
  });

  it('equal distance, horizontal', () => {
    HideUtil.equidistance(false, group);
    addLabels(30, 0);
    HideUtil.equidistance(false, group);
    const children = getChildren(group);
    expect(children.length).toBe(5);
    children.forEach((label, index) => {
      expect(label.attr('text')).toBe(labels[index * 2]);
    });
  });

  it('equal distance, with rotate', () => {
    addLabels(0, 5, Math.PI / 4);
    HideUtil.equidistance(true, group);
    const children = getChildren(group);
    expect(children.length).toBe(Math.ceil(labels.length / 3));
    children.forEach((label, index) => {
      expect(label.attr('text')).toBe(labels[index * 3]);
    });
  });

  it('equal distance, horizontal, with rotate', () => {
    HideUtil.equidistance(false, group);
    addLabels(30, 0, Math.PI / 4);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(labels.length); // 留的空白很大，所以不会有消失的
    addLabels(12, 0, Math.PI / 4);
    HideUtil.equidistance(false, group);
    const children = getChildren(group);
    expect(children.length).toBe(Math.ceil(labels.length / 2));
    // children.forEach((label, index) => {
    //   expect(label.attr('text')).toBe(labels[index * 2]);
    // });
  });

  it('reseve no limit', () => {
    addLabels(0, 20);
    HideUtil.reserveFirst(true, group, null);
    expect(getCount(group)).toBe(labels.length); // 13455222 超出限制

    HideUtil.reserveLast(true, group, null);
    expect(getCount(group)).toBe(labels.length);
  });
});
