import { Group, type DisplayObject } from '@antv/g';
import { visibility } from './visibility';

class OffscreenGroup extends Group {
  appendChild(child: any, index?: number | undefined) {
    visibility(child, false);
    return super.appendChild(child, index);
  }
}

export function createOffscreenGroup(container: DisplayObject) {
  const group = container.appendChild(
    new OffscreenGroup({
      class: 'offscreen',
      style: { visibility: 'hidden' },
    })
  );
  visibility(group, false);
  return group;
}
