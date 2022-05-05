import { Text } from '@antv/g';
import { intersect } from '../../../layout/intersect';

export function boundTest(items: Text[], margin?: number[]) {
  let a: Text;
  return [
    ...items.reduce((r, b, i) => {
      return !i || !a || !intersect(a, b, margin) ? ((a = b), r) : (r.add(a), r.add(b), r);
    }, new Set<Text>()),
  ];
}
