import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { getMatrixByAngle } from '../../util/matrix';
import { charAtLength, strLen } from '../../util/text';

const WRAP_CODE = '\n';

function preAdjustWrap(label: IElement, verticalFactor: number) {
    const x = label.attr('x');
    const y = label.attr('y');
    const matrix = getMatrixByAngle({ x, y }, 0);
    label.attr('matrix', matrix);
    label.attr('textAlign', 'center');
    const textBaseline = verticalFactor < 0 ? 'top' : 'bottom';
    label.attr('textBaseline', textBaseline);
}

function wrapLabel(label: IElement, limitLength: number, verticalFactor: number) {
    const text = label.attr('text');
    const labelLength = label.getBBox().width;
    const codeLength = strLen(text);
    let wrapped = false;
    preAdjustWrap(label, verticalFactor);
    if (limitLength < labelLength) {
        const reseveLength = Math.floor((limitLength / labelLength) * codeLength);
        const newText = wrapText(text, reseveLength);
        label.attr('text', newText);
        label.set('isWrapped', true);
        wrapped = true;
    }
    return wrapped;
}

function wrapText(str: string, reseveLength: number) {
    let breakIndex = 0;
    let rst = '';
    for (let i = 0, index = 0; i < reseveLength;) {
        const charLength = charAtLength(str, index);
        if (i + charLength <= reseveLength) {
            rst += str[index];
            i += charAtLength(str, index);
            index++;
            breakIndex = index;
        } else {
            break;
        }
    }
    // 根据设计标准，文本折行不能超过两行
    const wrappedText = rst + WRAP_CODE + str.substring(breakIndex, str.length);
    return wrappedText;
}

export function getDefault() {
    return wrapLabels;
}

export function wrapLabels(labelGroup: IGroup, limitLength: number, verticalFactor: number) {
    const children = labelGroup.getChildren();
    let wrapped = false;
    each(children, (label) => {
        const rst = wrapLabel(label, limitLength, verticalFactor);
        wrapped = wrapped || rst;
    });
    return wrapped;
}