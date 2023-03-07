import { DisplayObject } from '../shapes/DisplayObject';
import { traverse } from './traverse';

export function show(element: DisplayObject) {
  visibility(element, true);
}

export function hide(element: DisplayObject) {
  visibility(element, false);
}

export function visibility(element: DisplayObject, visiable: boolean) {
  const value = visiable ? 'visible' : 'hidden';
  traverse(element, (node) => {
    node.attr('visibility', value);
  });
}
