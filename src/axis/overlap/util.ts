import { IElement } from '@antv/g-base';

export function getLabelLength(isVertical: boolean, label) {
    const bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}

export function testLabel(label: IElement, limitLength: number): boolean {
    let needFormat = false;
    const labelLength = label.getBBox().width;
    if (limitLength < labelLength) {
        needFormat = true;
    }
    return needFormat;
}