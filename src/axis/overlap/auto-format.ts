import { IElement, IGroup } from '@antv/g-base';
import { each } from '@antv/util';
import { strLen } from '../../util/text';
import { testLabel } from './util';

function formatLabel(label: IElement, unit: number, suffix: string, precision: number) {
    const text = label.attr('text');
    // 轴的零值标签不参与格式化
    if (text === '0') {
        return text;
    }
    const value = parseFloat(text) / unit;
    const newText = formatText(value,precision);
    label.attr('text', `${newText}${suffix}`)
}

function getPrecision(labels:IElement[], unit: number, suffix: string, limitLength: number){
    const values = [];
    const length = [];
    each(labels,(label)=>{
        values.push(parseFloat(label.attr('text')) / unit);
        length.push(label.getBBox().width);
    });
    values.sort((a,b)=>{
        return b.toString().length - a.toString().length;
    });
    const maxLength = Math.max(...length);
    const maxCodeLength = strLen(values[0].toString());
    const suffixLength = strLen(suffix);
    const reseveLength = Math.floor((limitLength / maxLength) * maxCodeLength) - suffixLength;
    // 先尝试保留小数点后两位
    let valueCodeLength = strLen(values[0].toFixed(2).toString());
    if (valueCodeLength <= reseveLength) {
        return 2;
    }
    // 保留小数点后1位
    valueCodeLength = strLen(values[0].toFixed(1).toString());
    if (valueCodeLength <= reseveLength) {
        return 1
    }
    // 采用整数
    return 0;
}

function formatText(value: number, precision: number) {
    if(precision === 0){
       return Math.round(value); 
    }else{
        return value.toFixed(precision).toString();
    }
}

export function formatLabels(labelGroup: IGroup, limitLength: number, unit: number, suffix: string): boolean {
    const children = labelGroup.getChildren();
    let needFormat = false;
    each(children, (label) => {
        const rst = testLabel(label, limitLength);
        needFormat = needFormat || rst;
    });
    if (needFormat) {
        const precision = getPrecision(children,unit,suffix,limitLength);
        each(children, (label) => {
            formatLabel(label, unit, suffix, precision);
        });
        return true;
    }
    return false;
}

