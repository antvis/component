import { IElement } from '@antv/g-base';
import { charAtLength, strLen } from '../util/text';

const ELLIPSIS_CODE = '\u2026';
const ELLIPSIS_CODE_LENGTH = 2; // 省略号的长度

function ellipsisString(str: string, reseveLength: number, position) {
    let rst = '';
    for (let i = 0, index = 0; i < reseveLength;) {
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
    return rst;
}

export function ellipsisText(shape: IElement, limitLength: number, position: string): boolean {
    const text = shape.attr('text');
    const shapeLength = shape.getBBox().width;
    const codeLength = strLen(text);
    let ellipsised = false;
    if (limitLength < shapeLength) {
        const reseveLength = Math.floor((limitLength / shapeLength) * codeLength) - ELLIPSIS_CODE_LENGTH; // 计算出来的应该保存的长度
        let newText;
        if (reseveLength >= 0) {
            newText = ellipsisString(text, reseveLength, position);
        } else {
            newText = ELLIPSIS_CODE;
        }
        if (newText) {
            shape.attr('text', newText);
            ellipsised = true;
        }
    }
    if (ellipsised) {
        shape.set('tip', text);
    } else {
        shape.set('tip', null);
    }
    return ellipsised;
}