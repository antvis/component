import type { DisplayObject } from '@antv/g';
import { intersect } from '@/layout/intersect';

const nonempty = (x: any) => x !== undefined && x != null && `${x}` !== '';
export function assignNonempty<T>(target: Record<string, T>, source: Record<string, T>): Record<string, T> {
  for (const [key, value] of Object.entries(source)) {
    if (nonempty(value)) {
      target[key] = source[key];
    }
  }
  return target;
}

export function boundTest<T extends DisplayObject>(items: T[], margin?: number[]) {
  let prev: T;
  return [
    ...items.reduce((acc, curr, index) => {
      return !index || !prev || !intersect(prev, curr, margin)
        ? ((prev = curr), acc)
        : (acc.add(prev), acc.add(curr), acc);
    }, new Set<T>()),
  ];
}
