import { isArray, isNil, isNumber } from '@antv/util';
import { BBox, Region } from '../types';
export function formatPadding(padding: number | number[]): number[] {
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

export function clearDom(container: HTMLElement) {
  const children = container.childNodes;
  const length = children.length;
  for (let i = length - 1; i >= 0; i--) {
    container.removeChild(children[i]);
  }
}

export function hasClass(elements, cName): boolean {
  return !!elements.className.match(new RegExp(`(\\s|^)${cName}(\\s|$)`));
}

export function regionToBBox(region: Region): BBox {
  const { start, end } = region;
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxX = Math.max(start.x, end.x);
  const maxY = Math.max(start.y, end.y);
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

export function createBBox(x: number, y: number, width: number, height: number): BBox {
  return {
    x,
    y,
    width,
    height,
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
  };
}

export function getValueByPercent(min, max, percent) {
  return (1 - percent) * min + max * percent;
}
