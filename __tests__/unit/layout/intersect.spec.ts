import { Rect, Path, Text } from '@antv/g';
import { Bounds } from '../../../src/layout/bounds';
import { intersect, IntersectUtils } from '../../../src/layout/intersect';
import { createCanvas } from '../../utils/render';

type Box = { x1: number; y1: number; x2: number; y2: number; rotation?: number };

const canvas = createCanvas(900, 'svg');
function drawRect(box: Box, fill = '#1890FF') {
  const rect = canvas.appendChild(
    new Rect({
      style: { x: box.x1, y: box.y1, width: box.x2 - box.x1, height: box.y2 - box.y1, fill },
    })
  );
  rect.rotate(box.rotation || 0);
  return rect;
}
function intersectBox(b1: Box, b2: Box) {
  const a = drawRect(b1, 'pink');
  const b = drawRect(b2, 'lightgreen');
  const r = intersect(a, b);
  a.remove();
  b.remove();
  return r;
}

describe('Intersect', () => {
  it('intersectBox(box1, box2) without rotation', () => {
    const a = { x1: 0, y1: 1, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30.1, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersectBox(a, b)).toBe(false);

    const a1 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersectBox(a1, b1)).toBe(true);

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 50.1, x2: 60, y2: 80, rotation: 0 };
    expect(intersectBox(a2, b2)).toBe(false);
    canvas.removeChildren();
  });

  it('intersectBox(box1, box2) with rotation', () => {
    const a = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30, y1: 0, x2: 60, y2: 50, rotation: 40 };
    drawRect(a).translate(30, 90);
    expect(intersectBox(a, b)).toBe(true);
    canvas.removeChildren();

    const a1 = { x1: 0, y1: 1, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: -90 };
    drawRect(a1).translate(30, 90);
    drawRect(b1, 'red').translate(30, 90);
    expect(intersectBox(a1, b1)).toBe(false);
    canvas.removeChildren();

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: -20 };
    expect(intersectBox(a2, b2)).toBe(true);
    canvas.removeChildren();

    const a3 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b3 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: 20 };
    expect(intersectBox(a3, b3)).toBe(false);

    const a4 = { rotation: 28.000000209988553, x1: 4, y1: 52.5, x2: 88, y2: 67.5 };
    const b4 = { rotation: 28.000000209988553, x1: 44, y1: 52.5, x2: 92, y2: 67.5 };
    drawRect(a4).translate(30, 60);

    expect(intersectBox(a4, b4)).toBe(false);
    canvas.removeChildren();
  });

  it('boxes with negative rotation', () => {
    const boxes = [
      { x: 14, y: 125, width: 84, height: 15, left: 14, right: 98, top: 125, bottom: 140 },
      { x: 38.5, y: 125, width: 48, height: 15, left: 38.5, right: 86.5, top: 125, bottom: 140 },
    ];
    const [a1, b1] = boxes.map((box) => {
      return { x1: box.left, y1: box.top, x2: box.right, y2: box.bottom, rotation: -35 };
    });

    drawRect(a1, 'pink');
    drawRect(b1, 'lightgreen');
    expect(intersectBox(a1, b1)).toBe(false);
  });

  it('bugs', () => {
    const boxes = [
      { x: 724, y: 52.5, width: 48, height: 15, left: 724, right: 772, top: 52.5, bottom: 67.5 },
      { x: 764, y: 52.5, width: 84, height: 15, left: 764, right: 848, top: 52.5, bottom: 67.5 },
    ];
    const [a1, b1] = boxes.map((box) => {
      return { x1: box.left, y1: box.top, x2: box.right, y2: box.bottom, rotation: 30 };
    });

    drawRect(a1, 'red');
    drawRect(b1, 'green');
    expect(intersectBox(a1, b1)).toBe(false);
  });
});

describe('Utils for detect intersect', () => {
  it('lineToLine', () => {
    // 交叉
    expect(IntersectUtils.lineToLine([20, 20, 80, 20], [30, 0, 30, 50])).toBe(true);
    // 平行
    expect(IntersectUtils.lineToLine([20, 20, 80, 20], [0, 40, 80, 40])).toBe(false);
    // 延长线才交叉
    expect(IntersectUtils.lineToLine([20, 20, 80, 20], [0, 40, 80, 30])).toBe(false);
  });

  const path = (points: number[]) =>
    [
      ['M', points[0], points[1]],
      ['L', points[2], points[3]],
      ['L', points[4], points[5]],
      ['L', points[6], points[7]],
      ['Z'],
    ] as any;
  const Box = (points: number[], color = 'red', style = {}) =>
    canvas.appendChild(new Path({ style: { fill: color, stroke: color, ...style, path: path(points) } }));

  it('intersect box and line', () => {
    const box1 = [30, 20, 50, 20, 50, 40, 30, 40];
    const box = Box(box1);
    const drawLine = (line: any) =>
      canvas.appendChild(
        new Path({
          style: {
            stroke: 'blue',
            lineWidth: 1,
            path: [
              ['M', line[0], line[1]],
              ['L', line[2], line[3]],
            ],
          },
        })
      );
    let line = [60, 20, 60, 50];
    // 平行
    expect(IntersectUtils.intersectBoxLine(box1, line)).toBe(false);
    expect(IntersectUtils.intersectBoxLine(box1, [30, 50, 60, 50])).toBe(false);
    // 有一个相交点
    expect(IntersectUtils.intersectBoxLine(box1, [30, 20, 20, 50])).toBe(true);
    // 相交点偏移
    expect(IntersectUtils.intersectBoxLine(box1, [29, 0, 20, 30])).toBe(false);
    // 延长线才交叉
    line = [40, 50, 50, 60];
    expect(IntersectUtils.intersectBoxLine(box1, line)).toBe(false);

    line = [30, 42, 50, 42];
    drawLine(line);
    // 平行
    expect(IntersectUtils.intersectBoxLine(box1, line)).toBe(false);
    // 箱子旋转, 相交
    box.setEulerAngles(45);
    // Box 是正方形，重新计算顶点
    const { left, top, right, bottom } = box.getBBox();
    const r = (right - left) / 2;
    const box2 = [left, top + r, left + r, top, right, top + r, left + r, bottom];
    expect(IntersectUtils.intersectBoxLine(box2, line)).toBe(true);
  });

  it('bound', () => {
    const box1 = [30, 20, 50, 20, 50, 40, 30, 40];
    const box = Box(box1);
    box.setEulerAngles(45);
    const points = IntersectUtils.bound(new Bounds(), box);
    const { left, top, right, bottom } = box.getBBox();
    const r = (right - left) / 2;
    const box2Points = [left + r, top, left, top + r, left + r, bottom, right, top + r];
    points.every((point, idx) => expect(point).toBeCloseTo(box2Points[idx]));
  });

  // [todo] calculate text bound when rotation.
  it('bound Text', () => {
    const text = canvas.appendChild(new Text({ style: { x: 50, y: 200, text: 'GUI', fontSize: 30, fill: 'red' } }));
    const points = IntersectUtils.bound(new Bounds(), text);

    Box(points, 'green', { fillOpacity: 0, lineWidth: 1 });
    const [topX, topY, leftX, leftY, bottomX, bottomY, rightX, rightY] = points;
    expect(text.getBBox().x).toBeCloseTo(topX);
    expect(text.getBBox().x).toBeCloseTo(leftX);
    expect(text.getBBox().y).toBeCloseTo(topY);
    expect(text.getBBox().top).toBeCloseTo(rightY);
    expect(text.getBBox().right).toBeCloseTo(rightX);
    expect(text.getBBox().right).toBeCloseTo(bottomX);
    // 一点小误差
    expect(text.getBBox().bottom).toBeCloseTo(bottomY + 1.5);
    expect(text.getBBox().bottom).toBeCloseTo(leftY + 1.5);
  });
});
