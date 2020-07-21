import { IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { ellipsisLabel } from '../../util/label';

function ellipseLabels(isVertical: boolean, labelGroup: IGroup, limitLength: number, position: string): boolean {
  const children = labelGroup.getChildren();
  let ellipsised = false;
  each(children, (label) => {
    const rst = ellipsisLabel(isVertical, label, limitLength, position);
    ellipsised = ellipsised || rst;
  });
  return ellipsised;
}

export function getDefault() {
  return ellipsisTail;
}

export function ellipsisHead(isVertical: boolean, labelGroup: IGroup, limitLength: number): boolean {
  return ellipseLabels(isVertical, labelGroup, limitLength, 'head');
}

export function ellipsisTail(isVertical: boolean, labelGroup: IGroup, limitLength: number): boolean {
  return ellipseLabels(isVertical, labelGroup, limitLength, 'tail');
}

export function ellipsisMiddle(isVertical: boolean, labelGroup: IGroup, limitLength: number): boolean {
  return ellipseLabels(isVertical, labelGroup, limitLength, 'middle');
}
