import { transform, vec2, vec3 } from '@antv/matrix-util';
import { BBox, Point } from '../types';

const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point: Point, angle: number): number[] {
  if (!angle) {
    // 角度为 0 或者 null 时返回 null
    return null;
  }
  const m = transform(identityMatrix, [
    ['t', -point.x, -point.y],
    ['r', angle],
    ['t', point.x, point.y],
  ]);
  return m;
}

export function getMatrixByTranslate(point: Point, currentMatrix?: number[]): number[] {
  if (!point.x && !point.y) {
    // 0，0 或者 nan 的情况下返回 null
    return null;
  }
  return transform(currentMatrix || identityMatrix, [['t', point.x, point.y]]);
}

// 从矩阵获取旋转的角度
export function getAngleByMatrix(matrix: number[]): number {
  const xVector = [1, 0, 0];
  const out = [];
  vec3.transformMat3(out, xVector, matrix);
  return Math.atan2(out[1], out[0]);
}
// 矩阵 * 向量
function multiplyVec2(matrix, v) {
  const out = [];
  vec2.transformMat3(out, v, matrix);
  return out;
}

export function applyMatrix2BBox(matrix: number[], bbox: BBox) {
  const topLeft = multiplyVec2(matrix, [bbox.minX, bbox.minY]);
  const topRight = multiplyVec2(matrix, [bbox.maxX, bbox.minY]);
  const bottomLeft = multiplyVec2(matrix, [bbox.minX, bbox.maxY]);
  const bottomRight = multiplyVec2(matrix, [bbox.maxX, bbox.maxY]);
  const minX = Math.min(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
  const maxX = Math.max(topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]);
  const minY = Math.min(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
  const maxY = Math.max(topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]);
  return {
    x: minX,
    y: minY,
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
