import { Canvas } from '@antv/g-canvas';
import * as EllipsisUtil from '../../../src/axis/overlap/auto-ellipsis';
import { getMatrixByAngle } from '../../../src/util/matrix';

describe('test axis label ellipsis', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cah';
  const canvas = new Canvas({
    container: 'cah',
    width: 500,
    height: 500,
  });
  const group = canvas.addGroup();
  const labels = ['123', '12', '23444', '13455222', '2345', '2333', '222', '2222', '11', '33'];
  const labels1 = ['我爱中国', '爱情ab你', 'abc我是谁', '亲爱的你ok', 'are u ok'];
  function addLabels(arr, dx, dy, angle?) {
    group.clear();
    arr.forEach((label, index) => {
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

  it('ellipsis tail, vetical, without rotation', () => {
    addLabels(labels, 0, 20);
    EllipsisUtil.ellipsisTail(true, group, 40);

    const labelShapes = group.getChildren();
    expect(labelShapes[3].attr('text')).not.toBe(labels[3]);
    expect(labelShapes[3].get('tip')).toBe(labels[3]);
  });

  it('ellipsis tail, vetical, rotation', () => {
    addLabels(labels1, 0, 20);
    expect(EllipsisUtil.ellipsisTail(true, group, 50)).toBe(true);
    group.getChildren().forEach((label) => {
      expect(label.getCanvasBBox().width <= 50).toBe(true);
    });
    addLabels(labels1, 0, 20, -Math.PI / 4);
    expect(EllipsisUtil.ellipsisTail(true, group, 40)).toBe(true);
    group.getChildren().forEach((label) => {
      expect(label.getCanvasBBox().width <= 40).toBe(true);
    });
  });

  it('ellipsis head, horizontal', () => {
    addLabels(labels, 20, 0);
    EllipsisUtil.ellipsisTail(false, group, 30); // 不会进行任何省略
    group.getChildren().forEach((label) => {
      expect(label.get('tip')).toBe(null);
    });

    addLabels(labels, 20, 0, Math.PI / 4);
    expect(EllipsisUtil.ellipsisTail(false, group, 30)).toBe(true);

    group.getChildren().forEach((label) => {
      // 浮点数误差
      expect(Math.floor(label.getCanvasBBox().height) <= 30).toBe(true);
    });

    addLabels(labels1, 20, 0, Math.PI / 4);
    expect(EllipsisUtil.ellipsisTail(false, group, 30)).toBe(true);
  });

  it('head', () => {
    addLabels(labels, 0, 20);
    EllipsisUtil.ellipsisHead(true, group, 40);
    const labelShapes = group.getChildren();
    expect(labelShapes[3].attr('text')).not.toBe(labels[3]);
    expect(labelShapes[3].get('tip')).toBe(labels[3]);

    addLabels(labels, 0, 20, -Math.PI / 4);
    EllipsisUtil.ellipsisHead(true, group, 30);
    const labelShapes1 = group.getChildren();
    expect(labelShapes1[3].attr('text')).not.toBe(labels[3]);
    expect(labelShapes1[3].get('tip')).toBe(labels[3]);

    addLabels(labels, 20, 0, Math.PI / 4);
    EllipsisUtil.ellipsisHead(false, group, 40);
    const labelShapes2 = group.getChildren();
    expect(labelShapes2[3].attr('text')).not.toBe(labels[3]);
    expect(labelShapes2[3].get('tip')).toBe(labels[3]);
  });

  it('middle', () => {
    addLabels(labels, 0, 20);
    EllipsisUtil.ellipsisMiddle(true, group, 40);
    const labelShapes = group.getChildren();
    expect(labelShapes[3].attr('text')).not.toBe(labels[3]);
    expect(labelShapes[3].get('tip')).toBe(labels[3]);

    addLabels(labels, 0, 20);
    EllipsisUtil.ellipsisMiddle(true, group, 60);
    const labelShapes1 = group.getChildren();
    expect(labelShapes1[3].attr('text')).toBe(labels[3]);
    expect(labelShapes1[3].get('tip')).not.toBe(labels[3]);

    addLabels(labels, 20, 0, Math.PI / 4);
    EllipsisUtil.ellipsisMiddle(false, group, 40);
    const labelShapes2 = group.getChildren();
    expect(labelShapes2[3].attr('text')).not.toBe(labels[3]);
    expect(labelShapes2[3].get('tip')).toBe(labels[3]);
  });
});
