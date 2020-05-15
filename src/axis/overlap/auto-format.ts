import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { strLen, testLabel } from './util';

function formatLabel(label: IElement, unit: number, suffix: string, limitLength: number) {
    const text = label.attr('text');
    // 轴的零值标签不参与格式化
    if (text === '0') {
        return text;
    }
    const labelLength = label.getBBox().width;
    const codeLength = strLen(text);
    const reseveLength = Math.floor((limitLength / labelLength) * codeLength) - 1;
    const value = parseFloat(text) / unit;
    const newText = formatText(value,reseveLength);
    label.attr('text', `${newText}${suffix}`)
}

function formatText(value: number, reseveLength: number) {
    // 先尝试保留小数点后两位
    let valueCodeLength = strLen(value.toFixed(2).toString);
    if (valueCodeLength <= reseveLength) {
        return value.toFixed(2);
    }
    // 保留小数点后1位
    valueCodeLength = strLen(value.toFixed(1).toString);
    if (valueCodeLength <= reseveLength) {
        return value.toFixed(1);
    }
    // 采用整数
    return Math.round(value);
}

export function formatLabels(labelGroup: IGroup, limitLength: number, unit: number, suffix: string): boolean {
    const children = labelGroup.getChildren();
    let needFormat = false;
    each(children, (label) => {
        const rst = testLabel(label, limitLength);
        needFormat = needFormat || rst;
    });
    if (needFormat) {
        each(children, (label) => {
            formatLabel(label, unit, suffix, limitLength);
        });
        return true;
    }
    return false;
}

