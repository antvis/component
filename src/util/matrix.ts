import { transform, vec3 } from '@antv/matrix-util';
import { Point } from '../types';

const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point: Point, angle: number): number[] {
  if (!angle) {
    // 角度为 0 或者 null 时返回 null
    return null;
  }
  const m = transform(identityMatrix, [['t', -point.x, -point.y], ['r', angle], ['t', point.x, point.y]]);
  return m;
}

export function getMatrixByTranslate(point: Point): number[] {
  if (!point.x && !point.y) {
    // 0，0 或者 nan 的情况下返回 null
    return null;
  }
  return transform(identityMatrix, [['t', point.x, point.y]]);
}

// 从矩阵获取旋转的角度
export function getAngleByMatrix(matrix: number[]): number {
  const xVector = [1, 0, 0];
  const out = [];
  vec3.transformMat3(out, xVector, matrix);
  return Math.atan2(out[1], out[0]);
}
