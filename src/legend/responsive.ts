import { IElement, IGroup } from '@antv/g-base';
import { LegendItemNameCfg, LegendItemValueCfg, LegendMarkerCfg } from '../types'
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

export function ellipsisText(shape: IElement, limitLength: number, position: string) {
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

function getMakerCalCfg(group: IGroup, cfg){
    const shape = getItemShape(group,'legend-item-marker');
    const width = shape ? shape.getBBox().width : 0;
    const spacing = shape ? cfg.spacing : 0;
    return { width, spacing };
}

function getNameCalCfg(group: IGroup, cfg){
    const shape = getItemShape(group,'legend-item-name');
    const width = shape ? shape.getBBox().width : 0;
    const spacing = shape ? cfg.spacing : 0;
    return { width, spacing };
}

export function getItemValueLimitLength( group: IGroup, itemMarkerCfg: LegendMarkerCfg, itemNameCfg: LegendItemNameCfg, totalLimit: number ){
    const markerCalCfg = getMakerCalCfg(group,itemMarkerCfg);
    const nameCalCfg = getNameCalCfg(group,itemNameCfg);
    return totalLimit - markerCalCfg.width - markerCalCfg.spacing - nameCalCfg.width - nameCalCfg.spacing;
}

export function getItemNameLimitLength( group: IGroup, itemMarkerCfg: LegendMarkerCfg, itemNameCfg: LegendItemNameCfg, totalLimit: number ){
    const valueShape = getItemShape(group,'legend-item-value');
    const markerCalCfg = getMakerCalCfg(group,itemMarkerCfg);
    if(valueShape){
        return totalLimit - markerCalCfg.width - markerCalCfg.spacing - itemNameCfg.spacing - valueShape.getBBox().width;
    }
    return totalLimit - markerCalCfg.width - markerCalCfg.spacing;
}

export function getItemShape(group: IGroup, name: string){
    const nameShape = group.findAll((el) => {
      if (el.get('name')) {
        return el.get('name') === name;
      }
    })[0];
    return nameShape;
}

export function updateValuePosition(shape: IElement, group: IGroup, itemNameCfg: LegendItemNameCfg){
    const nameShape = getItemShape(group,'legend-item-name');
    const nameSpacing = nameShape ? itemNameCfg.spacing : 0;
    const targetX = nameShape.attr('x') + nameShape.getBBox().width + nameSpacing;
    shape.attr('x', targetX);
}