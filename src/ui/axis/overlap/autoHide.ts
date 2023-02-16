import type { DisplayObject } from '@antv/g';
import { RequiredStyleProps } from '../../../core';
import { intersect } from '../../../layout/intersect';
import { defined, getLocalBBox } from '../../../util';
import { isAxisHorizontal, isAxisVertical } from '../guides/line';
import type { AxisStyleProps, HideOverlapCfg } from '../types';
import { boundTest } from '../utils/helper';

type Hide = (item: DisplayObject) => void;
type Show = (item: DisplayObject) => void;
export type Utils = { hide: Hide; show: Show };

const methods: Record<string, (items: DisplayObject[], args: any) => DisplayObject[]> = {
  parity: (items: DisplayObject[], { seq = 2 }) =>
    items.filter((item, i) => (i % seq ? ((item.style.visibility = 'hidden'), false) : true)),
};

const filterDefined = (arr: any[]) => arr.filter((d) => defined(d));

export default function equidistance(
  labels: DisplayObject[],
  overlapCfg: HideOverlapCfg,
  attr: RequiredStyleProps<AxisStyleProps>,
  utils: Utils
) {
  const count = labels.length;
  const { keepHeader, keepTail } = overlapCfg;
  if (count <= 1) return;
  if (count === 2 && keepHeader && keepTail) return;

  const parityHide = methods.parity;
  const reset = (els: DisplayObject[]) => (els.forEach(utils.show), els);
  let seq = 2;
  // 浅复制
  const source = labels.slice();
  let target = labels.slice();
  // Generally, 100 ticks cost less than 20ms. If cost time exceed, means ticks count is too large to see.
  const timeout = 200;
  const now = Date.now();

  const minLabelWidth = Math.min(1, ...labels.map((d) => d.getBBox().width));
  // @ts-ignore
  if (attr.style!.type === 'linear' && (isAxisHorizontal(attr) || isAxisVertical(attr))) {
    const minX = getLocalBBox(labels[0]).left;
    const maxX = getLocalBBox(labels[count - 1]).right;
    const distance = Math.abs(maxX - minX) || 1;
    seq = Math.max(Math.floor((count * minLabelWidth) / distance), seq);
  }

  let first;
  let last;
  if (keepHeader) {
    first = source.splice(0, 1)[0];
  }
  if (keepTail) {
    last = source.splice(-1, 1)[0];
    source.reverse();
  }
  while (boundTest(filterDefined(last ? [last, ...target, first] : [first, ...target]), overlapCfg?.margin).length) {
    // 每两步，减一个 (不需要考虑保留 first)
    if (last && !first && seq % 2 === 0) {
      const rest = source.splice(0, 1);
      rest.forEach(utils.hide);
    } else if (last && first) {
      // 如果有 first 的话，每一步，减一个（增加迭代次数）
      const rest = source.splice(0, 1);
      rest.forEach(utils.hide);
    }

    target = parityHide(reset(source), { seq });
    seq++;
    // layout time exceeded;
    if (Date.now() - now > timeout) return;
  }
}

export function greedy(labels: DisplayObject[], overlapCfg: HideOverlapCfg) {
  const count = labels.length;
  if (count <= 1) return;
  const { keepHeader, keepTail } = overlapCfg;
  if (count === 2 && keepHeader && keepTail) return;

  // 浅复制
  const source = labels.slice();

  let a: DisplayObject;
  source.forEach((b, i) => {
    if (!i || !a || !intersect(a, b, overlapCfg?.margin)) {
      a = b;
    } else if (i === count - 1 && keepTail) {
      a.style.visibility = 'hidden';
    } else {
      b.style.visibility = 'hidden';
    }
  });
}
