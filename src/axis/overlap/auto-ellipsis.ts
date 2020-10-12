import { IGroup } from '@antv/g-base';
import { get, reduce, isNumber } from '@antv/util';
import { ellipsisLabel } from '../../util/label';

// 真实的 数字，而不是 NaN
function isRealNumber(v: any) {
  return isNumber(v) && !isNaN(v);
}

function gethorizontalLimitLength(horizontalLimitLengthArray, idx: number): number {
  const prev = get(horizontalLimitLengthArray, [idx - 1]);
  const curr = get(horizontalLimitLengthArray, [idx]);
  const next = get(horizontalLimitLengthArray, [idx + 1]);

  let left = (curr - prev) / 2;
  let right = (next - curr) / 2;
  if (isRealNumber(left)) {
    if (isRealNumber(right)) {
      return left + right;
    } else {
      return left * 2;
    }
  } else {
    if (isRealNumber(right)) {
      return right * 2;
    } else {
      return undefined;
    }
  }
}

function ellipseLabels(isVertical: boolean, labelGroup: IGroup, limitLength: number, position: string, horizontalLimitLengthArray?: number[]): boolean {
  const children = labelGroup.getChildren();

  return reduce(children, (ellipsised: boolean, label, idx: number): boolean => {
    // 1. 根据 verticalLimitLength 进行省略
    // 2. 根据 horizontalLimitLength 进行省略
    const horizontalLimitLength = gethorizontalLimitLength(horizontalLimitLengthArray, idx);
    const rst = ellipsisLabel(isVertical, label, limitLength, horizontalLimitLength, position);
    // 只有有一个省略，就返回 true
    return ellipsised || rst;
  }, false);
}

export function getDefault() {
  return ellipsisTail;
}

export function ellipsisHead(isVertical: boolean, labelGroup: IGroup, limitLength: number, horizontalLimitLengthArray?: number[]): boolean {
  return ellipseLabels(isVertical, labelGroup, limitLength, 'head', horizontalLimitLengthArray);
}

export function ellipsisTail(isVertical: boolean, labelGroup: IGroup, limitLength: number, horizontalLimitLengthArray?: number[]): boolean {
  return ellipseLabels(isVertical, labelGroup, limitLength, 'tail', horizontalLimitLengthArray);
}

export function ellipsisMiddle(isVertical: boolean, labelGroup: IGroup, limitLength: number, horizontalLimitLengthArray?: number[]): boolean {
  return ellipseLabels(isVertical, labelGroup, limitLength, 'middle', horizontalLimitLengthArray);
}
