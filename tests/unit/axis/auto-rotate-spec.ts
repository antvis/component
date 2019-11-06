import { Canvas } from '@antv/g-canvas';
import * as RotateUtil from '../../../src/axis/overlap/auto-rotate';
import { getAngleByMatrix } from '../../../src/util/matrix';
import Theme from '../../../src/util/theme';

describe('test auto rotate', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'car';
  const canvas = new Canvas({
    container: 'car',
    width: 500,
    height: 500,
  });
  const group = canvas.addGroup();
  const labels = ['123', '12', '2344', '13455222', '2345'];
  function addLabels(dx, dy) {
    group.clear();
    labels.forEach((label, index) => {
      group.addShape({
        type: 'text',
        attrs: {
          x: 100 + dx * index,
          y: 100 + dy * index,
          text: label,
          fill: 'red',
        },
      });
    });
  }
  it('test one label', () => {
    RotateUtil.fixedAngle(false, group, 10); // 0 label
    const shape = group.addShape({
      type: 'text',
      attrs: {
        x: 0,
        y: 0,
        text: '113344',
      },
    });
    expect(RotateUtil.fixedAngle(false, group, 10)).toBe(false); // 1 label
    expect(shape.attr('matrix')).toBe(null);
    expect(RotateUtil.fixedAngle(true, group, 10)).toBe(true);
    expect(shape.attr('matrix')).not.toBe(null);
  });
  it('test vertical labels, fixed angle rotate', () => {
    addLabels(0, 20);
    RotateUtil.fixedAngle(true, group, 20);
    const matrix = group.getChildren()[0].attr('matrix');
    expect(matrix).not.toBe(null);
    expect(getAngleByMatrix(matrix)).toBe(Theme.verticalAxisRotate);

    addLabels(0, 20);
    const rst = RotateUtil.fixedAngle(true, group, 60);
    expect(group.getChildren()[0].attr('matrix')).toBe(null);
    expect(rst).toBe(false);
  });

  it('test horizontal labels, fixed angle rotate', () => {
    addLabels(40, 0);
    expect(RotateUtil.fixedAngle(false, group, 20)).toBe(true);
    const matrix = group.getChildren()[0].attr('matrix');
    expect(matrix).not.toBe(null);
    expect(getAngleByMatrix(matrix)).toBe(Theme.horizontalAxisRotate);

    addLabels(60, 0);
    expect(RotateUtil.fixedAngle(false, group, 20)).toBe(false);
    expect(group.getChildren()[0].attr('matrix')).toBe(null);
  });

  it('test vertical labels, all angle rotate', () => {
    addLabels(0, 30);
    expect(RotateUtil.unfixedAngle(true, group, 20)).toBe(true);
    expect(RotateUtil.unfixedAngle(true, group, 30)).toBe(true);
    expect(RotateUtil.unfixedAngle(true, group, 50)).toBe(true);
    expect(RotateUtil.unfixedAngle(true, group, 60)).toBe(false);
  });

  it('test horizontal labels, all angle rotate', () => {
    addLabels(40, 0);
    expect(RotateUtil.unfixedAngle(false, group, 20)).toBe(true);
    expect(RotateUtil.unfixedAngle(false, group, 30)).toBe(true);
    expect(RotateUtil.unfixedAngle(false, group, 50)).toBe(true);
    expect(RotateUtil.unfixedAngle(false, group, 60)).toBe(true);
    const matrix = group.getChildren()[0].attr('matrix');
    expect(getAngleByMatrix(matrix)).toBe(Math.PI / 4);
  });

  it('test labels, no limit', () => {
    addLabels(0, 20);
    expect(RotateUtil.fixedAngle(true, group, null)).toBe(false);
    expect(RotateUtil.unfixedAngle(true, group, null)).toBe(false);

    addLabels(20, 0);
    expect(RotateUtil.fixedAngle(false, group, null)).toBe(true);
    const matrix = group.getChildren()[0].attr('matrix');
    expect(getAngleByMatrix(matrix)).toBe(Theme.horizontalAxisRotate);
  });
  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});
