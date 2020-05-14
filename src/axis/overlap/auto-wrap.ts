import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { charAtLength, getLabelLength, strLen,  } from './util';

const WRAP_CODE = '\n';

function wrapLabel(isVertical: boolean, label: IElement, limitLength: number){
    const text = label.attr('text');
    const labelLength = getLabelLength(isVertical, label);
    const codeLength = strLen(text);
    let ellipsised = false;
    if (limitLength < labelLength) {
        const reseveLength = Math.floor((limitLength / labelLength) * codeLength);
        const newText = wrapText(text,reseveLength);
        label.attr('text', newText);
        ellipsised = true;
    }
    return ellipsised;
}

function wrapText(str:string, reseveLength: number){
    let breakIndex;
    let rst = '';
    for (let i = 0, index = 0; i < reseveLength; ) {
        const charLength = charAtLength(str, index);
        if (i + charLength <= reseveLength) {
            rst += str[index];
            i += charAtLength(str, index);
            index++;
          } else {
            breakIndex = index;
            break;
          }
    }
    const wrappedText = rst + WRAP_CODE + str.split(breakIndex,str.length - breakIndex);
    return wrappedText;
}

export function wrapLabels(isVertical: boolean, labelGroup: IGroup, limitLength: number){
    const children = labelGroup.getChildren();
    let wrapped = false;
    each(children, (label) => {
        const rst = wrapLabel(isVertical, label, limitLength);
        wrapped = wrapped || rst;
    });
    return wrapped;
}