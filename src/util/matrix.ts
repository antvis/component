import { transform } from '@antv/matrix-util';
const identityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export function getMatrixByAngle(point, angle) {
  const m = transform(identityMatrix, [['t', -point.x, -point.y], ['r', angle], ['t', point.x, point.y]]);
  return m;
}

export function getMatrixByTranslate(point) {
  return transform(identityMatrix, [['t', point.x, point.y]]);
}
