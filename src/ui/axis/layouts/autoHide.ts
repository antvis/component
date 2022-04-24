import { AxisLabel } from '../types/shape';
import { intersect } from '../utils/intersect';
import { boundTest } from '../utils/helper';

const methods: Record<string, (items: AxisLabel[], args: any) => AxisLabel[]> = {
  parity: (items: AxisLabel[], { seq = 2 }) =>
    items.filter((item, i) => (i % seq ? (item.style.visibility = 'hidden') : 1)),
  greedy: (items: AxisLabel[]) => {
    let a: AxisLabel;
    return items.filter((b, i) =>
      !i || !intersect(a.style.bounds, b.style.bounds) ? ((a = b), 1) : (b.style.visibility = 'hidden')
    );
  },
};

// reset all items to be fully visible
export const reset = (source: AxisLabel[]) => (source.forEach((item) => (item.style.visibility = 'visible')), source);

/**
 * AutoHide Layout for axis label when overlap
 */
export function AutoHide(labels: AxisLabel[], labelCfg: any, method = 'greedy') {
  const reduce = methods[method] || methods.greedy;

  let seq = 2;
  let source = labels;
  const timeout = 500;
  const now = Date.now();
  while (boundTest(source).length) {
    source = reduce(reset(labels), { seq });
    seq++;
    if (Date.now() - now > timeout) {
      // console.warn('layout time exceeded');
      return;
    }
  }
}
