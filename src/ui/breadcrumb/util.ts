import { isNumber } from '@antv/util';

export function transformPadding(padding: number | number[] = [0, 0, 0, 0]) {
  if (!Array.isArray(padding) && typeof padding !== 'number') {
    throw new Error('padding must be number or array');
  }
  let newPadding: number | number[] = padding;
  if (typeof padding === 'number') {
    newPadding = [padding, padding, padding, padding];
  } else if (Array.isArray(padding)) {
    const top = padding[0];
    const right = isNumber(padding[1]) ? padding[1] : padding[0];
    const bottom = isNumber(padding[2]) ? padding[2] : padding[0];
    const left = isNumber(padding[3]) ? padding[3] : right;
    newPadding = [top, right, bottom, left];
  }
  return newPadding;
}
