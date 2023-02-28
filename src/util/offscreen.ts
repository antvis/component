import { Group, type DisplayObject, ElementEvent } from '@antv/g';
import { hide } from './visibility';

class OffscreenGroup extends Group {
  constructor(...args: any[]) {
    super(...args);
    this.addEventListener(ElementEvent.INSERTED, () => {
      hide(this);
    });
  }
}

export function createOffscreenGroup(container: DisplayObject) {
  const group = container.appendChild(
    new OffscreenGroup({
      class: 'offscreen',
    })
  );
  hide(group);
  return group;
}

export function isInOffscreenGroup(group: Group) {
  let ancestor: any = group;
  while (ancestor) {
    if (ancestor.className === 'offscreen') {
      return true;
    }
    ancestor = ancestor.parent;
  }
  return false;
}
