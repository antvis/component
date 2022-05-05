// Condition on x-direction axis.
export const ifX = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'top' || orient === 'bottom' ? a : b;
// Condition on y-direction axis.
export const ifY = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'left' || orient === 'right' ? a : b;
// Condition on arc axis align outside.
export const ifOutside = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'outside' ? a : b;
// Condition on x-direction axis in the top.
export const ifTop = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'top' ? a : b;
// Condition on x-direction axis in the bottom.
export const ifBottom = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'bottom' ? a : b;
// Condition on y-direction axis in the left.
export const ifLeft = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'left' ? a : b;
// Condition on y-direction axis in the right.
export const ifRight = <T = string | number | undefined>(orient: string, a: T, b?: T): T | undefined =>
  orient === 'right' ? a : b;
// Get sign coefficient based on axis orient.
export const getSign = (orient: string, a: number, b: number) =>
  orient === 'left' || orient === 'top' || orient === 'inside' ? a : b;

const nonempty = (x: any) => x !== undefined && x != null && `${x}` !== '';
export function assignNonempty<T>(target: Record<string, T>, source: Record<string, T>): Record<string, T> {
  for (const [key, value] of Object.entries(source)) {
    if (nonempty(value)) {
      target[key] = source[key];
    }
  }
  return target;
}
