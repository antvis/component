import type { DisplayObject } from '@antv/g';
import { traverse } from './traverse';

export function visibility(element: DisplayObject, visiable: boolean) {
  const value = visiable ? 'visibility' : 'hidden';
  traverse(element, (node) => {
    node.attr('visible', value);
  });
}
