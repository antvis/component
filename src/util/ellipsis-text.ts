import { IElement } from '@antv/g-base';
import { getLabelLength } from './label';
import { ellipsisString, strLen } from './text';

const ELLIPSIS_CODE = '\u2026';
const ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度

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
