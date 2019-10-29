import { Point } from '@antv/g-base/lib/types';
import { transform } from '@antv/matrix-util';

const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point: Point, angle: number): number[] {
  const m = transform(identityMatrix, [['t', -point.x, -point.y], ['r', angle], ['t', point.x, point.y]]);
  return m;
}

export function getMatrixByTranslate(point: Point): number[] {
  return transform(identityMatrix, [['t', point.x, point.y]]);
}
