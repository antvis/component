import { IElement } from '@antv/g-base';

/** 获取label长度 */
export function getLabelLength(isVertical: boolean, label) {
    const bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}

/* label长度是否超过约束值 */
export function testLabel(label: IElement, limitLength: number): boolean {
    return label.getBBox().width < limitLength;
}