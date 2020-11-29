import { Canvas, IGroup } from '@antv/g-canvas';
import * as HideUtil from '../../../src/axis/overlap/auto-hide';
import { getMatrixByAngle } from '../../../src/util/matrix';

const doAddLabels = (group: IGroup, labels: string[], dx: number, dy: number, angle?: number) => {
  group.clear();
  labels.forEach((label, index) => {
    const x = 100 + dx * index;
    const y = 100 + dy * index;
    const shape = group.addShape({
      type: 'text',
      id: `label${index}`,
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
};

const hasOverlap = (group: IGroup, minGap = 0) => {
  const labels = group.getChildren().filter((child) => child.get('visible'));
  if (labels.length < 2) {
    return false;
  }
  const isVertical = labels[1].attr('x') === labels[0].attr('x');
  const sorted = labels.sort((label) => (isVertical ? label.attr('x') : label.attr('y')));
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i += 1) {
    if (isVertical) {
      if (prev.getBBox().maxY + minGap > sorted[i].getBBox().minY) {
        return true;
      }
    } else {
      if (prev.getBBox().maxX + minGap > sorted[i].getBBox().minX) {
        return true;
      }
    }
    prev = sorted[i];
  }
  return false;
};

describe('test auto hide', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 1000,
    height: 1000,
  });
  const group = canvas.addGroup();
  const labels = ['123', '12', '2344', '13455222', '2345', '2333', '222', '2222', '11', '33'];
  const addLabels = (dx: number, dy: number, angle?: number) => doAddLabels(group, labels, dx, dy, angle);
  function addLabel(label: string, dx: number, dy: number, angle?: number) {
    const last = group.getLast();
    const x = (last ? last.attr('x') : 100) + dx;
    const y = (last ? last.attr('y') : 100) + dy;
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
    HideUtil.reserveFirst(true, group); // empty
    // 不会重叠
    addLabels(0, 20);
    HideUtil.reserveFirst(true, group);
    expect(getCount(group)).toBe(labels.length);

    // 没有足够的高度，纵向会重叠
    addLabels(0, 10);
    HideUtil.reserveFirst(true, group); // 仅仅去除高度上重叠的
    expect(getFirst(group).attr('text')).toBe(labels[0]);
    expect(getCount(group)).toBe(Math.round(labels.length / 2)); // 剩余一半
  });

  it('reserve first, vertical, width rotate', () => {
    addLabels(0, 20, -Math.PI / 4); // 文本旋转
    HideUtil.reserveFirst(true, group); // 足够的高度
    expect(group.getChildren().length).toBe(labels.length);

    addLabels(0, 10, -Math.PI / 4);
    HideUtil.reserveFirst(true, group); // 最长的被去除
    expect(getCount(group)).toBe(Math.round(labels.length / 2)); // 剩余一半
  });

  it('reserve first, horizontal, no rotate', () => {
    addLabels(40, 0); // 不旋转的文本
    HideUtil.reserveFirst(false, group);
    expect(getCount(group)).toBe(labels.length - 1);

    addLabels(25, 0);
    HideUtil.reserveFirst(false, group);
    expect(getCount(group)).toBe(labels.length - 3);

    addLabels(60, 0); // 没有遮挡
    HideUtil.reserveFirst(false, group);
    expect(getCount(group)).toBe(labels.length);
  });

  it('reserve first, horizontal, with rotate', () => {
    addLabels(40, 0, Math.PI / 4);
    HideUtil.reserveFirst(false, group); // 旋转后不会重叠
    expect(getCount(group)).toBe(labels.length);

    addLabels(10, 0, Math.PI / 4); // 非常密集
    HideUtil.reserveFirst(false, group); // 不超出限制
    expect(getCount(group)).toBe(Math.round(labels.length / 2)); // 剩余一半
    expect(getFirst(group).attr('text')).toBe(labels[0]); // 保留第一个
  });

  it('reserve last, vertical', () => {
    addLabels(0, 10); // 没有足够的高度
    HideUtil.reserveLast(true, group); // 不处理超出限制的
    expect(getFirst(group).attr('text')).not.toBe(labels[0]); // 保留第一个
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);

    addLabels(30, 0);
    HideUtil.reserveLast(false, group);
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('reserve both', () => {
    addLabels(0, 10); // 没有足够的高度
    HideUtil.reserveBoth(true, group);
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
    expect(children.length).toBe(3);
    children.forEach((label, index) => {
      expect(label.attr('text')).toBe(labels[index * 4]);
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
    HideUtil.reserveFirst(true, group);
    expect(getCount(group)).toBe(labels.length); // 13455222 超出限制

    HideUtil.reserveLast(true, group);
    expect(getCount(group)).toBe(labels.length);
  });

  it('equal distance, with last extra tick', () => {
    addLabels(60, 0);
    addLabel('last_last_x', 60, 0);
    addLabel('last_x', 50, 0);
    HideUtil.equidistance(false, group);

    // no overlap
    const children = getChildren(group);
    children.forEach((cur, idx) => {
      if (idx > 0) {
        const prev = children[idx - 1];
        expect(prev.getBBox().maxX < cur.getBBox().minX).toBe(true);
      }
    });
  });

  it('equidistanceWithReverseBoth, horizontal', () => {
    // 宽度足够，不会隐藏
    addLabels(100, 0);
    HideUtil.equidistanceWithReverseBoth(false, group);
    expect(getCount(group)).toBe(labels.length);

    // 出现隐藏，首尾被保留
    addLabels(50, 0);
    HideUtil.equidistanceWithReverseBoth(false, group);
    expect(getCount(group)).toBe(6);
    expect(getFirst(group).attr('text')).toBe(labels[0]);
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('equidistanceWithReverseBoth, horizontal, with rotate', () => {
    addLabels(50, 0, Math.PI / 4);
    HideUtil.equidistanceWithReverseBoth(false, group);
    expect(getCount(group)).toBe(labels.length);

    addLabels(15, 0, Math.PI / 4);
    HideUtil.equidistanceWithReverseBoth(false, group);
    expect(getCount(group)).toBe(5);
    expect(getFirst(group).attr('text')).toBe(labels[0]);
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('equidistanceWithReverseBoth, vertical', () => {
    addLabels(0, 20);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount(group)).toBe(labels.length);

    addLabels(0, 10);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount(group)).toBe(5);
    expect(getFirst(group).attr('text')).toBe(labels[0]);
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('equidistanceWithReverseBoth, vertical, with rotate', () => {
    addLabels(0, 20, (3 * Math.PI) / 4);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount(group)).toBe(labels.length);

    addLabels(0, 10, (3 * Math.PI) / 4);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount(group)).toBe(5);
    expect(getFirst(group).attr('text')).toBe(labels[0]);
    expect(getLast(group).attr('text')).toBe(labels[labels.length - 1]);
  });

  it('equal distance, vertical, with rotate', () => {
    // interval < 1
    addLabels(0, 70, Math.PI / 4);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(labels.length);

    // interval > 1: interval = 2
    addLabels(0, 12, Math.PI / 4);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    addLabels(0, 12, Math.PI * 2.25);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    // negative angle interval > 1: interval = 2
    addLabels(0, 12, -Math.PI / 4);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    addLabels(0, 12, -Math.PI * 2.25);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    // cos(Math.PI / 2) = 0: interval = 3
    addLabels(0, 20, Math.PI / 2);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(labels.filter((v, idx) => idx % 3 === 0).length);
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 3]);
    });

    // near zero 在一度的精度之内: interval = 3
    addLabels(0, 20, Math.PI / 2 - 0.01);
    HideUtil.equidistance(true, group);
    expect(getCount(group)).toBe(labels.filter((v, idx) => idx % 3 === 0).length);
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 3]);
    });
  });

  it('equal distance, horizontal, with rotate', () => {
    // interval < 1
    addLabels(50, 0, Math.PI / 7);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(labels.length);

    // interval = 2
    addLabels(20, 0, Math.PI / 7);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    addLabels(20, 0, (Math.PI * 6) / 7);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    addLabels(20, 0, -Math.PI / 7);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    addLabels(20, 0, -(Math.PI * 6) / 7);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    // math.sin(0) = 0
    addLabels(30, 0, 0);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });

    addLabels(10, 0, Math.PI / 2);
    HideUtil.equidistance(false, group);
    expect(getCount(group)).toBe(Math.floor(labels.length / 2));
    getChildren(group).forEach((label, idx) => {
      expect(label.attr('text')).toBe(labels[idx * 2]);
    });
  });

  afterAll(() => {
    dom.remove();
  });
});

describe('auto hide /w cfg', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 1000,
    height: 1000,
  });
  const group = canvas.addGroup();
  const COUNT = 8;
  const evenLabels = [];
  for (let i = 0; i < COUNT; i += 1) {
    evenLabels.push(`2020-12-0${i}`);
  }
  const labels = ['123', '12', '2344', '13455222', '2345', '2333', '222', '2222', '11', '33'];
  const addEvenLabels = (dx: number, dy: number, angle?: number) => doAddLabels(group, evenLabels, dx, dy, angle);
  const addLabels = (dx: number, dy: number, angle?: number) => doAddLabels(group, labels, dx, dy, angle);

  function getCount() {
    const children = group.getChildren();
    let count = 0;
    children.forEach((shape) => {
      if (shape.get('visible')) {
        count++;
      }
    });
    return count;
  }
  addEvenLabels(0, 0);
  const itemLen = group.getFirst().getBBox().width;

  it('equidistance, horizontal', () => {
    addEvenLabels(itemLen, 0);
    // 默认配置： 无最小间距 → 全部显示
    HideUtil.equidistance(false, group);
    expect(getCount()).toBe(COUNT);
    expect(hasOverlap(group)).toBeFalsy();

    // 设置最小间距 → 抽样
    HideUtil.equidistance(false, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(hasOverlap(group)).toBeFalsy();
    HideUtil.equidistance(false, group, undefined, { minGap: itemLen + 1 });
    expect(getCount()).toBe(Math.ceil(COUNT / 4));
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('equidistance, horizontal rotate', () => {
    // 45°
    // 无最小间距 → 全部显示
    addEvenLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.equidistance(false, group);
    expect(getCount()).toBe(COUNT);
    // 设置最小间距 → 抽样
    addEvenLabels(12 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.equidistance(false, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));

    // 90°
    // 无最小间距 → 全部显示
    addEvenLabels(13, 0, Math.PI / 2);
    HideUtil.equidistance(false, group);
    expect(getCount()).toBe(COUNT);
    // 设置最小间距 → 抽样
    addEvenLabels(13, 0, Math.PI / 2);
    HideUtil.equidistance(false, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));

    // 135°
    // 无最小间距 → 全部显示
    addEvenLabels(13 / Math.sin((3 * Math.PI) / 4), 0, (3 * Math.PI) / 4);
    HideUtil.equidistance(false, group);
    expect(getCount()).toBe(COUNT);
    // 设置最小间距 → 抽样
    addEvenLabels(13 / Math.sin((3 * Math.PI) / 4), 0, (3 * Math.PI) / 4);
    HideUtil.equidistance(false, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
  });

  it('equidistance, vertical', () => {
    // 无最小间距 → 全部显示
    addEvenLabels(0, 13);
    HideUtil.equidistance(true, group);
    expect(getCount()).toBe(COUNT);
    expect(hasOverlap(group)).toBeFalsy();

    // 设置最小间距 → 抽样
    addEvenLabels(0, 13);
    HideUtil.equidistance(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('equidistance, vertical, rotate', () => {
    // 45°
    // 无最小间距 → 全部显示
    addEvenLabels(0, 13 / Math.sin(Math.PI / 4), Math.PI / 4);
    HideUtil.equidistance(true, group);
    expect(getCount()).toBe(COUNT);
    addEvenLabels(0, 13 / Math.sin(Math.PI / 4), Math.PI / 4);
    HideUtil.equidistance(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));

    // 90°
    addEvenLabels(0, (itemLen + 1) / Math.sin(Math.PI / 2), Math.PI / 2);
    HideUtil.equidistance(true, group);
    expect(getCount()).toBe(COUNT);
    addEvenLabels(0, (itemLen + 1) / Math.sin(Math.PI / 2), Math.PI / 2);
    HideUtil.equidistance(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));

    // 145°
    addEvenLabels(0, 13 / Math.sin((3 * Math.PI) / 4), (3 * Math.PI) / 4);
    HideUtil.equidistance(true, group);
    expect(getCount()).toBe(COUNT);
    addEvenLabels(0, 13 / Math.sin((Math.PI * 3) / 4), (Math.PI * 3) / 4);
    HideUtil.equidistance(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
  });

  it('equidistanceWithReserveBoth, horizontal', () => {
    addEvenLabels(itemLen + 1, 0);
    HideUtil.equidistanceWithReverseBoth(false, group);
    expect(getCount()).toBe(COUNT);
    expect(hasOverlap(group)).toBeFalsy();

    addEvenLabels(itemLen + 1, 0);
    HideUtil.equidistanceWithReverseBoth(false, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById(`label${COUNT - 1}`).get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('equidistanceWithReserveBoth, vertical', () => {
    addEvenLabels(0, 13);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount()).toBe(COUNT);
    expect(hasOverlap(group)).toBeFalsy();

    addEvenLabels(0, 13);
    HideUtil.equidistanceWithReverseBoth(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById(`label${COUNT - 1}`).get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('equidistanceWithReverseBoth, vertical, rotate', () => {
    // 45°
    addEvenLabels(0, 13 / Math.sin(Math.PI / 4), Math.PI / 4);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount()).toBe(COUNT);

    addEvenLabels(0, 13 / Math.sin(Math.PI / 4), Math.PI / 4);
    HideUtil.equidistanceWithReverseBoth(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById(`label${COUNT - 1}`).get('visible')).toBeTruthy();

    // 90°
    addEvenLabels(0, (itemLen + 1) / Math.sin(Math.PI / 2), Math.PI / 2);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount()).toBe(COUNT);
    addEvenLabels(0, (itemLen + 1) / Math.sin(Math.PI / 2), Math.PI / 2);
    HideUtil.equidistanceWithReverseBoth(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById(`label${COUNT - 1}`).get('visible')).toBeTruthy();

    // 135°
    addEvenLabels(0, 13 / Math.sin((Math.PI * 3) / 4), (Math.PI * 3) / 4);
    HideUtil.equidistanceWithReverseBoth(true, group);
    expect(getCount()).toBe(COUNT);
    addEvenLabels(0, 13 / Math.sin((Math.PI * 3) / 4), (Math.PI * 3) / 4);
    HideUtil.equidistanceWithReverseBoth(true, group, undefined, { minGap: 6 });
    expect(getCount()).toBe(Math.ceil(COUNT / 2));
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById(`label${COUNT - 1}`).get('visible')).toBeTruthy();
  });

  it('reserveFirst, horizontal', () => {
    addLabels(21, 0);
    HideUtil.reserveFirst(false, group);
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById('label1').get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();

    addLabels(21, 0);
    HideUtil.reserveFirst(false, group, undefined, { minGap: 6 });
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById('label1').get('visible')).toBeFalsy();
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('reserveFirst, horizontal, rotate', () => {
    addLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.reserveFirst(false, group);
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById('label1').get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.reserveFirst(false, group, undefined, { minGap: 6 });
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById('label1').get('visible')).toBeFalsy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, -Math.PI / 4);
    HideUtil.reserveFirst(false, group);
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById('label1').get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, -Math.PI / 4);
    HideUtil.reserveFirst(false, group, undefined, { minGap: 6 });
    expect(group.findById('label0').get('visible')).toBeTruthy();
    expect(group.findById('label1').get('visible')).toBeFalsy();
  });

  it('reserveLast, horizontal', () => {
    addLabels(20, 0);
    HideUtil.reserveLast(false, group);
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 2}`).get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();

    addLabels(20, 0);
    HideUtil.reserveLast(false, group, undefined, { minGap: 12 });
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 2}`).get('visible')).toBeFalsy();
    expect(hasOverlap(group)).toBeFalsy();

    addLabels(100 / (labels.length - 1), 0);
    HideUtil.reserveLast(false, group);
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('reserveLast, horizontal, rotated', () => {
    addLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.reserveLast(false, group);
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 2}`).get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.reserveLast(false, group, undefined, { minGap: 6 });
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 2}`).get('visible')).toBeFalsy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, -Math.PI / 4);
    HideUtil.reserveLast(false, group);
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 2}`).get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, -Math.PI / 4);
    HideUtil.reserveLast(false, group, undefined, { minGap: 6 });
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 2}`).get('visible')).toBeFalsy();
  });

  it('reverseBoth, horizontal', () => {
    addLabels(20, 0);
    HideUtil.reserveBoth(false, group);
    expect(group.findById(`label0`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();

    addLabels(20, 0);
    HideUtil.reserveBoth(false, group, undefined, { minGap: 12 });
    expect(group.findById(`label0`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
    expect(hasOverlap(group)).toBeFalsy();
  });

  it('reserveBoth, horizontal, rotated', () => {
    addLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.reserveBoth(false, group);
    expect(group.findById(`label0`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, Math.PI / 4);
    HideUtil.reserveBoth(false, group, undefined, { minGap: 6 });
    expect(group.findById(`label0`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, -Math.PI / 4);
    HideUtil.reserveBoth(false, group);
    expect(group.findById(`label0`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();

    addLabels(13 / Math.sin(Math.PI / 4), 0, -Math.PI / 4);
    HideUtil.reserveBoth(false, group, undefined, { minGap: 6 });
    expect(group.findById(`label0`).get('visible')).toBeTruthy();
    expect(group.findById(`label${labels.length - 1}`).get('visible')).toBeTruthy();
  });

  it('reserveLast', () => {
    const labels1 = ['123', '12', '2344', '13455222', '2345', '2333', '222', '2222', '11', '33'];
    doAddLabels(group, labels, 100 / 9, 0);
    HideUtil.reserveLast(false, group);
  });
});
