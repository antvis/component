import { IElement } from '@antv/g-base/lib/interfaces';
import { each } from '@antv/util';

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
