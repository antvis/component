import { isNumber, isArray } from '@antv/util';

type NormalPaddingType = [number, number, number, number];

/**
 * 规范化padding
 */
export function normalPadding(padding: number | number[]): NormalPaddingType {
  if (isNumber(padding)) {
    return [padding, padding, padding, padding];
  }
  if (isArray(padding)) {
    const len = (padding as number[]).length;

    if (len === 1) {
      return [padding[0], padding[0], padding[0], padding[0]];
    }
    if (len === 2) {
      return [padding[0], padding[1], padding[0], padding[1]];
    }
    if (len === 3) {
      return [padding[0], padding[1], padding[2], padding[1]];
    }
    if (len === 4) {
      return padding as NormalPaddingType;
    }
  }
  return [0, 0, 0, 0];
}
