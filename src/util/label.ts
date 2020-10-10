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

/** 获取label宽度高度 */
export function getLabelLength(isVertical: boolean, label) {
  const bbox = label.getCanvasBBox();
  return isVertical ? [bbox.height, bbox.width] : [bbox.width, bbox.height];
}

/* label长度是否超过约束值 */
export function testLabel(label: IElement, limitLength: number): boolean {
    return label.getBBox().width < limitLength;
}

/** 处理 text shape 的自动省略 */
/**
 * 
 * @param isVertical 是否水平
 * @param label 标签
 * @param verticalLimitLength 纵向限制大小
 * @param horizontalLimitLength 横向限制大小 undefined 则不限制
 * @param position 
 */
export function ellipsisLabel(isVertical: boolean, label: IElement, verticalLimitLength: number, horizontalLimitLength: number, position: string = 'tail') {
  const text = label.attr('text');
  const [labelHorizontalLength, labelVerticalLength] = getLabelLength(isVertical, label);
  const codeLength = strLen(text);

  const ellipsisedByVertical = verticalLimitLength < labelVerticalLength;
  // 如果为空，则设置最大的限制，即无限制
  horizontalLimitLength = !horizontalLimitLength ? Number.MAX_SAFE_INTEGER : horizontalLimitLength;
  const ellipsisedByHorizontal = horizontalLimitLength < labelHorizontalLength;

  if (ellipsisedByVertical || ellipsisedByHorizontal) {
    const reseveLengthByVertical = Math.floor((verticalLimitLength / labelVerticalLength) * codeLength) - ELLIPSIS_CODE_LENGTH; // 计算出来的应该保存的长度
    const reseveLengthByHorizontal = Math.floor((horizontalLimitLength / labelHorizontalLength) * codeLength) - ELLIPSIS_CODE_LENGTH; // 计算出来的应该保存的长度

    const reseveLength = Math.min(reseveLengthByVertical, reseveLengthByHorizontal);

    const newText = reseveLength >= 0 ? ellipsisString(text, reseveLength, position) : ELLIPSIS_CODE;

    if (newText) {
      label.attr('text', newText);
      // tip 用于隐藏的时候 hover 显示全称  
      label.set('tip', text);
      return true;
    }
  }

  label.set('tip', null);
  return false;
}
