import { get } from '@antv/util';

type Vec2 = [number, number];
type Point = { x: number; y: number };
export type Bounds = { x1: number; y1: number; x2: number; y2: number; rotation?: number; points?: Point[] };

export type Item = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  visible?: boolean;
  id?: number | string;
};

function dot(a: number[], b: number[]) {
  return Math.abs(a[0] * b[0] + a[1] * b[1] + (a[2] || 0) * (b[2] || 0));
}
/**
 * 1. 获取检测轴的单位向量
 */
function getAxes(rotation: number): Vec2[] {
  // 由于 矩形的平行原理，所以只有 2 条投影轴: A -> B, B -> C
  const deg = (angle: number) => (angle * 180) / Math.PI;
  const AB = [Math.cos(deg(rotation)), Math.sin(deg(rotation))] as Vec2;
  const BC = [-Math.sin(deg(rotation)), Math.cos(deg(rotation))] as Vec2;

  return [AB, BC];
}

/**
 * @private
 * 绕指定点顺时针旋转后的点坐标
 * 默认绕原点旋转
 */
function rotateAtPoint(point: Point, deg = 0, origin = { x: 0, y: 0 }): Point {
  if (deg === 0) return point;

  const { x, y } = point;
  const r = Math.sqrt((origin.x - x) ** 2 + (origin.y - y) ** 2);
  return {
    x: origin.x + r * Math.cos((deg / 180) * Math.PI),
    y: origin.y + r * Math.sin((deg / 180) * Math.PI),
  };
}

function isValidNumber(d: number) {
  return typeof d === 'number' && !Number.isNaN(d) && d !== Infinity && d !== -Infinity;
}

function isValidBox(box: Bounds) {
  return ['x1', 'y1', 'x2', 'y2'].every((attr) => isValidNumber(get(box, attr)));
}

/**
 * Compute bounding box intersection, including padding pixels of separation
 */
export function rectIntersect(a: Bounds, b: Bounds, margin: number = 0): boolean {
  return margin > Math.max(b.x1 - a.x2, a.x1 - b.x2, b.y1 - a.y2, a.y1 - b.y2);
}

function getProjectionRadius(box: Bounds, axis: Vec2, axes: Vec2[]): number {
  const px = dot(axis, axes[0]);
  const py = dot(axis, axes[1]);

  return ((box.x2 - box.x1) / 2) * px + ((box.y2 - box.y1) / 2) * py;
}

/**
 * Detect whether two shape is intersected.
 * Bounds of input boxes is before rotated.
 *
 * - 原理: 分离轴定律
 */
export function intersect(box1: Bounds, box2: Bounds, margin: number = 0) {
  // 如果两个 box 中有一个是不合法的 box，也就是不会被渲染出来的，那么它们就不相交。
  if (!isValidBox(box1) || !isValidBox(box2)) return false;

  // 如果两个矩形没有旋转，使用快速判断
  if (!box1.rotation && !box2.rotation) {
    return rectIntersect(box1, box2, margin);
  }

  const c1 = rotateAtPoint({ x: (box1.x2 + box1.x1) / 2, y: (box1.y2 + box1.y1) / 2 }, box1.rotation, {
    x: box1.x1,
    y: box1.y1,
  });
  const c2 = rotateAtPoint({ x: (box2.x2 + box2.x1) / 2, y: (box2.y2 + box2.y1) / 2 }, box2.rotation, {
    x: box2.x1,
    y: box2.y1,
  });
  const centerVector = [c1.x - c2.x, c1.y - c2.y];

  // 获取所有投影轴
  const axes1 = getAxes(box1.rotation || 0);
  const axes2 = getAxes(box2.rotation || 0);
  const axes = axes1.concat(axes2);

  for (let i = 0; i < axes.length; i++) {
    const axis = axes[i];
    if (getProjectionRadius(box1, axis, axes1) + getProjectionRadius(box2, axis, axes2) <= dot(centerVector, axis))
      return false;
  }

  return true;
}
