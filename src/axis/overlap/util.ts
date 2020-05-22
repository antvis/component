import { IElement } from '@antv/g-base';

const LABEL_SPACING = 2;

/** 获取label长度 */
export function getLabelLength(isVertical: boolean, label) {
    const bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}

/* label长度是否超过约束值 */
export function testLabel(label: IElement, limitLength: number): boolean {
    return label.getBBox().width < limitLength;
}

export function calHorizontalLimitLength(start, end, group){
    const totalLength = Math.abs(end.x - start.x);
    const labelCount = group.get('children').length;
    return (totalLength - (labelCount + 1) * LABEL_SPACING) / labelCount;
}