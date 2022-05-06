import { vec2 } from '@antv/matrix-util';
import type { vec2 as Vector } from '@antv/matrix-util';

const { abs } = Math;

export * from './boundTest';
export * from './helper';
export * from './applyAnimation';

/**
 * 获得给定向量的垂直单位向量
 */
export function getVerticalVector([x, y]: Vector, factor = 1): Vector {
  if (x === 0 && y === 0) return [x, y];
  let vec: Vector;
  const f = (v: number) => {
    const a = abs(v);
    if (factor === 1) return a;
    return -a;
  };
  if (x === 0 || y === 0) vec = [f(y), f(x)];
  else vec = [1, -(x / y)];
  return vec2.normalize([0, 0], vec);
}

/**
 * 计算2范数
 */
//  export function norm2([x1, y1]: Vector) {
//   return sqrt(x1 ** 2 + y1 ** 2);
// }

// /**
//  *  获取包围盒中心
//  */
// export function getBoundsCenter(shape: DisplayObject): Point {
//   const bounds = shape.getBounds()!;
//   const [[x1, y1], [x2, y2]] = [bounds.getMin(), bounds.getMax()];
//   return [(x1 + x2) / 2, (y1 + y2) / 2];
// }

// /**
//  * 对shape进行中心旋转
//  * 适用于 origin 与包围盒中心不重叠的情况
//  * 主要用于 标题 旋转
//  */
// export function centerRotate(shape: DisplayObject, angle: number) {
//   const currX = shape.attr('x');
//   const currY = shape.attr('y');
//   // 记录旋转前位置
//   const [beforeX, beforeY] = getBoundsCenter(shape);
//   // 旋转
//   shape.setLocalEulerAngles(angle);
//   // 旋转后位置
//   const [afterX, afterY] = getBoundsCenter(shape);
//   // 重新调整位置
//   shape.attr({
//     x: currX + beforeX - afterX,
//     y: currY + beforeY - afterY,
//   });
// }

// export function formatAngle(angle: number) {
//   let formatAngle = angle;
//   if (formatAngle < 0) {
//     formatAngle += Math.ceil(formatAngle / -360) * 360;
//   }
//   formatAngle %= 360;
//   return formatAngle;
// }
