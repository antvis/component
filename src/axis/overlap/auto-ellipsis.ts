import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { ellipsisString, strLen } from '../../util/text';
import {  getLabelLength } from './util';

const ELLIPSIS_CODE = '\u2026';
const ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度

function ellipsisLabel(isVertical: boolean, label: IElement, limitLength: number, position) {
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
