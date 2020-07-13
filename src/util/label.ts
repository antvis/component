import { IElement } from '@antv/g-base';
import { each } from '@antv/util';

/** 获取最长的 label */
export function getMaxLabelWidth(labels: IElement[]) {
  let max = 0;
  each(labels, (label) => {
    const bbox = label.getBBox();
    const width = bbox.width;
    if (max < width) {
      max = width;
    }
  });
  return max;
}

/** 获取label长度 */
export function getLabelLength(isVertical: boolean, label) {
    const bbox = label.getCanvasBBox();
    return isVertical ? bbox.width : bbox.height;
}

/* label长度是否超过约束值 */
export function testLabel(label: IElement, limitLength: number): boolean {
    return label.getBBox().width < limitLength;
}
