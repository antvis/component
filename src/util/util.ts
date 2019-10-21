import { isArray, isNil, isNumber } from '@antv/util';

export function formatPadding(padding: number | number[]) {
  let top = 0;
  let left = 0;
  let right = 0;
  let bottom = 0;

  if (isNumber(padding)) {
    top = left = right = bottom = padding;
  } else if (isArray(padding)) {
    top = padding[0];
    right = !isNil(padding[1]) ? padding[1] : padding[0];
    bottom = !isNil(padding[2]) ? padding[2] : padding[0];
    left = !isNil(padding[3]) ? padding[3] : right;
  }

  return [top, right, bottom, left];
}
