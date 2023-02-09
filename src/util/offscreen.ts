import { Group, type DisplayObject } from '@antv/g';
import { visibility } from './visibility';

class OffscreenGroup extends Group {
  // a offscreen can only have one child
  appendChild(child: any, index?: number | undefined) {
    this.destroyChildren();
    visibility(child, false);
    return super.appendChild(child, index);
  }
}

export function createOffscreenGroup(container: DisplayObject) {
  const group = container.appendChild(
    new OffscreenGroup({
      style: { visibility: 'hidden' },
    })
  );
  visibility(group, false);
  return group;
}
