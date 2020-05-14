import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { charAtLength, getLabelLength, strLen,  } from './util';

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

function ellipsisString(str, reseveLength: number, position) {
  const count = str.length;
  let rst = '';
  if (position === 'tail') {
    for (let i = 0, index = 0; i < reseveLength; ) {
      const charLength = charAtLength(str, index);
      if (i + charLength <= reseveLength) {
        rst += str[index];
        i += charAtLength(str, index);
        index++;
      } else {
        break;
      }
    }
    rst += ELLIPSIS_CODE;
  } else if (position === 'head') {
    for (let i = 0, index = count - 1; i < reseveLength; ) {
      const charLength = charAtLength(str, index);
      if (i + charLength <= reseveLength) {
        rst += str[index];
        i += charAtLength(str, index);
        index--;
      } else {
        break;
      }
    }
    rst = ELLIPSIS_CODE + rst;
  } else {
    let startStr = '';
    let endStr = '';
    for (let i = 0, startIndex = 0, endIndex = count - 1; i < reseveLength; ) {
      const startCodeLen = charAtLength(str, startIndex);
      let hasAdd = false; // 设置标志位，防止头尾都没有附加字符
      if (startCodeLen + i <= reseveLength) {
        startStr += str[startIndex];
        startIndex++;
        i += startCodeLen;
        hasAdd = true;
      }

      const endCodeLen = charAtLength(str, endIndex);
      if (endCodeLen + i <= reseveLength) {
        endStr = str[endIndex] + endStr;
        i += endCodeLen;
        endIndex--;
        hasAdd = true;
      }
      if (!hasAdd) {
        // 如果都没有增加字符，说明都不适合则中断
        break;
      }
    }
    rst = startStr + ELLIPSIS_CODE + endStr;
  }
  return rst;
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
