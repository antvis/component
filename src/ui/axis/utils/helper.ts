import { Text } from '@antv/g';
import { intersect } from '../../../layout/intersect';

// Condition on x-direction axis.
export const ifX = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'top' || position === 'bottom' ? a : b;
// Condition on y-direction axis.
export const ifY = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'left' || position === 'right' ? a : b;
// Condition on arc axis align outside.
export const ifOutside = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'outside' ? a : b;
// Condition on x-direction axis in the top.
export const ifTop = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'top' ? a : b;
// Condition on x-direction axis in the bottom.
export const ifBottom = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'bottom' ? a : b;
// Condition on y-direction axis in the left.
export const ifLeft = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'left' ? a : b;
// Condition on y-direction axis in the right.
export const ifRight = <T = string | number | undefined>(position: string, a: T, b?: T): T | undefined =>
  position === 'right' ? a : b;
// Get sign coefficient based on axis position.
export const getSign = (position: string, a: number, b: number) =>
  position === 'left' || position === 'top' || position === 'inside' ? a : b;

const nonempty = (x: any) => x !== undefined && x != null && `${x}` !== '';
export function assignNonempty<T>(target: Record<string, T>, source: Record<string, T>): Record<string, T> {
  for (const [key, value] of Object.entries(source)) {
    if (nonempty(value)) {
      target[key] = source[key];
    }
  }
  return target;
}

export function boundTest(items: Text[], margin?: number[]) {
  let a: Text;
  return [
    ...items.reduce((r, b, i) => {
      return !i || !a || !intersect(a, b, margin) ? ((a = b), r) : (r.add(a), r.add(b), r);
    }, new Set<Text>()),
  ];
}
