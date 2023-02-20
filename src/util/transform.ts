import { DisplayObject } from '@antv/g';
import type { Selection } from './selection';

/** get attr value in transform */
export function getTransform(node: DisplayObject, attr: string): number[] | undefined {
  const transform = node.computedStyleMap().get('transform') as any;
  if (!transform || transform.value === 'unset') return undefined;
  return (transform as { t: string; d: { value: number }[] }[])
    ?.find(({ t }) => t === attr)
    ?.d.map(({ value }) => value);
}

export function hasSetRotate(node: DisplayObject): boolean {
  return !!getTransform(node, 'rotate');
}

export function getTranslate(node: DisplayObject, x: string, y: string) {
  const { width, height } = node.getBBox();
  const [tx, ty] = [x, y].map((v, i) => {
    return v.includes('%')
      ? (parseFloat(v.match(/[+-]?([0-9]*[.])?[0-9]+/)?.[0] || '0') / 100) * (i === 0 ? width : height)
      : v;
  });
  return [tx, ty];
}

export function translate(node: DisplayObject, x: string, y: string) {
  const [tx, ty] = getTranslate(node, x, y);
  node.attr('transform', `translate(${tx}, ${ty})`);
}

/**
 * transform that support translate percent value
 */
export function percentTransform(node: DisplayObject, val: string) {
  if (!val) return;
  try {
    const reg = /translate\(([+-]*[\d]+[%]*),[ ]*([+-]*[\d]+[%]*)\)/g;

    const computedVal = val.replace(reg, (match, x, y) => `translate(${getTranslate(node, x, y)})`);
    node.attr('transform', computedVal);
  } catch (e) {
    // do nothing
  }
}
