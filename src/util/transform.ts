import { DisplayObject } from '@antv/g';
import type { Selection } from './selection';

/** get attr value in transform */
export function getTransform(el: DisplayObject | Selection, attr: string): number[] | undefined {
  const node = el instanceof DisplayObject ? el : el.node();
  const transform = node.computedStyleMap().get('transform') as any;
  if (!transform || transform.value === 'unset') return undefined;
  return (transform as { t: string; d: { value: number }[] }[])
    ?.find(({ t }) => t === attr)
    ?.d.map(({ value }) => value);
}

export function hasSetRotate(el: DisplayObject | Selection): boolean {
  return !!getTransform(el, 'rotate');
}

export function getTranslate(el: DisplayObject | Selection, x: string, y: string) {
  const node = el instanceof DisplayObject ? el : el.node();
  const { width, height } = node.getBBox();
  const [tx, ty] = [x, y].map((v, i) => {
    return v.includes('%')
      ? (parseFloat(v.match(/[+-]?([0-9]*[.])?[0-9]+/)?.[0] || '0') / 100) * (i === 0 ? width : height)
      : v;
  });
  return [tx, ty];
}

export function translate(el: DisplayObject | Selection, x: string, y: string) {
  const node = el instanceof DisplayObject ? el : el.node();
  const [tx, ty] = getTranslate(el, x, y);
  node.attr('transform', `translate(${tx}, ${ty})`);
}

/**
 * transform that support translate percent value
 */
export function percentTransform(el: DisplayObject | Selection, val: string) {
  if (!val) return;
  try {
    const node = el instanceof DisplayObject ? el : el.node();
    const reg = /translate\(([+-]*[\d]+[%]*),[ ]*([+-]*[\d]+[%]*)\)/g;

    const computedVal = val.replace(reg, (match, x, y) => `translate(${getTranslate(node, x, y)})`);
    node.attr('transform', computedVal);
  } catch (e) {
    // do nothing
  }
}
