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
