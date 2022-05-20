import { vec2 } from '@antv/matrix-util';
import type { vec2 as Vector } from '@antv/matrix-util';

const { abs } = Math;

export * from './boundTest';
export * from './helper';

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
