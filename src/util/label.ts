import { IElement } from '@antv/g-base';
import { each } from '@antv/util';

import { ellipsisString, strLen } from './text';

const ELLIPSIS_CODE = '\u2026';
const ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度

/** 获取最长的 label */
export function getMaxLabelWidth(labels: IElement[]) {
  let max = 0;
  each(labels, (label) => {
    const bbox = label.getBBox();
    const width = bbox.width;
    if (max < width) {
      max = width;
    }
  });
  return max;
}

/** 获取label长度 */
export function getLabelLength(isVertical: boolean, label) {
    const bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}

/* label长度是否超过约束值 */
export function testLabel(label: IElement, limitLength: number): boolean {
    return label.getBBox().width < limitLength;
}

/** 处理 text shape 的自动省略 */
export function ellipsisLabel(isVertical: boolean, label: IElement, limitLength: number, position: string = 'tail') {
  const text = label.attr('text');
  const labelLength = getLabelLength(isVertical, label);
  const codeLength = strLen(text);
  let ellipsised = false;
  if (limitLength < labelLength) {
    const reseveLength = Math.floor((limitLength / labelLength) * codeLength) - ELLIPSIS_CODE_LENGTH; // 计算出来的应该保存的长度
    let newText;
    if (reseveLength >= 0) {
      newText = ellipsisString(text, reseveLength, position);
    } else {
      newText = ELLIPSIS_CODE;
    }
    if (newText) {
      label.attr('text', newText);
      ellipsised = true;
    }
  }
  if (ellipsised) {
    label.set('tip', text);
  } else {
    label.set('tip', null);
  }
  return ellipsised;
}
