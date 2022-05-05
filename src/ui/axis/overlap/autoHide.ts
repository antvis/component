import { Text } from '@antv/g';
import { defined, getLocalBBox } from '../../../util';
import { intersect } from '../../../layout/intersect';
import { boundTest } from '../utils';

const methods: Record<string, (items: Text[], args: any) => Text[]> = {
  parity: (items: Text[], { seq = 2 }) =>
    items.filter((item, i) => (i % seq ? ((item.style.visibility = 'hidden'), false) : true)),
};

// reset all items to be fully visible
const reset = (source: Text[]) => (source.forEach((item) => (item.style.visibility = 'visible')), source);

const filterDefined = (arr: any[]) => arr.filter((d) => defined(d));

function equidistance(orient: string | null, labels: Text[], cfg?: any) {
  const count = labels.length;
  if (count <= 1) return;
  if (count === 2 && cfg?.showFirst && cfg?.showLast) return;

  const parityHide = methods.parity;
  let seq = 2;
  // 浅复制
  const source = labels.slice();
  let target = labels.slice();
  // Generally, 100 ticks cost less than 20ms. If cost time exceed, means ticks count is too large to see.
  const timeout = 200;
  const now = Date.now();

  const minLabelWidth =
    Math.min.apply(
      null,
      labels.map((d) => d.getBBox().width)
    ) || 1;
  if (orient === 'top' || orient === 'bottom') {
    const minX = getLocalBBox(labels[0]).left;
    const maxX = getLocalBBox(labels[count - 1]).right;
    const distance = Math.abs(maxX - minX) || 1;
    seq = Math.max(Math.floor((count * minLabelWidth) / distance), seq);
  }

  let first;
  let last;
  if (cfg?.showFirst) {
    first = source.splice(0, 1)[0];
  }
  if (cfg?.showLast) {
    last = source.splice(-1, 1)[0];
    source.reverse();
  }
  while (boundTest(filterDefined(last ? [last, ...target, first] : [first, ...target]), cfg?.margin).length) {
    // 每两步，减一个 (不需要考虑保留 first)
    if (last && !first && seq % 2 === 0) {
      const rest = source.splice(0, 1);
      rest.forEach((d) => (d.style.visibility = 'hidden'));
    } else if (last && first) {
      // 如果有 first 的话，每一步，减一个（增加迭代次数）
      const rest = source.splice(0, 1);
      rest.forEach((d) => (d.style.visibility = 'hidden'));
    }

    target = parityHide(reset(source), { seq });
    seq++;
    // layout time exceeded;
    if (Date.now() - now > timeout) return;
  }
}

function greedy(orient: string | null, labels: Text[], cfg?: any) {
  const count = labels.length;
  if (count <= 1) return;
  if (count === 2 && cfg?.showFirst && cfg?.showLast) return;

  // 浅复制
  const source = labels.slice();

  let a: Text;
  source.forEach((b, i) => {
    if (!i || !a || !intersect(a, b, cfg?.margin)) {
      a = b;
    } else if (i === count - 1 && cfg?.showLast) {
      a.style.visibility = 'hidden';
    } else {
      b.style.visibility = 'hidden';
    }
  });
}

export default {
  getDefault: () => equidistance,
  equidistance,
  greedy,
};
