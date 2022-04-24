import { AxisLabel } from '../types/shape';
import { intersect } from './intersect';

/**
 * Apply bounds to label shape. [Mutable]
 */
export function applyBounds(labels: AxisLabel[], margin: number[] = [0, 0, 0, 0]) {
  return labels.map((shape) => {
    const rotation = shape.getLocalEulerAngles();

    shape.setLocalEulerAngles(0);
    const { min, max } = shape.getLocalBounds();
    shape.setLocalEulerAngles(rotation);

    const [top = 0, right = 0, bottom = top, left = right] = margin;
    const [width, height] = [max[0] - min[0], max[1] - min[1]];
    const [boxWidth, boxHeight] = [left + width + right, top + height + bottom];
    const [x1, y1] = min;
    const bounds = { rotation, x1, y1, x2: x1 + boxWidth, y2: y1 + boxHeight };
    shape.setAttribute('bounds', bounds);
    return shape;
  });
}

export function boundTest(items: AxisLabel[]) {
  let a: AxisLabel;
  return [
    ...items.reduce((r, b, i) => {
      return !i || !intersect(a.style.bounds, b.style.bounds) ? ((a = b), r) : (r.add(a), r.add(b), r);
    }, new Set<AxisLabel>()),
  ];
}
