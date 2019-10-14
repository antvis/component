import {transform} from '@antv/matrix-util';

export function getMatrixByAngle(point, angle) {
  const m = transform([1, 0, 0, 0, 1, 0, 0, 0, 1], [
    ['t', - point.x, - point.y],
    ['r', angle],
    ['t', point.x, point.y]
  ]);
  return m;
}