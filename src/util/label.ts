import { IElement } from '@antv/g-base';
import { each } from '@antv/util';

import { ellipsisString, strLen } from './text';

const ELLIPSIS_CODE = '\u2026';
const ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度
const OPTIMIZE_THRESHOLD = 400;

function getMaxLabelWidthOptimized(labels: IElement[]) {
  const texts: string[] = labels.map((label) => label.attr('text'));
  let maxLen = 0;
  let maxIdx = 0;

  for (let i = 0; i < texts.length; i += 1) {
    let len = 0;
    for (let j = 0; j <= texts[i].length; j += 1) {
      const code = texts[i].charCodeAt(j);
      if (code >= 19968 && code <= 40869) {
        len += 2;
      } else {
        len += 1;
      }
    }
    if (len > maxLen) {
      maxLen = len;
      maxIdx = i;
    }
  }

  return labels[maxIdx].getBBox().width;
}

/** 获取最长的 label */
export function getMaxLabelWidth(labels: IElement[]) {
  if (labels.length > OPTIMIZE_THRESHOLD) {
    return getMaxLabelWidthOptimized(labels);
  }

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
