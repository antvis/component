import { DisplayObject } from 'types';

/**
 * 获得图形的x、y、width、height
 */
export function getShapeSpace(shape: DisplayObject) {
  const bounds = shape && shape.getRenderBounds();
  if (!bounds)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  const max = bounds.getMax();
  const min = bounds.getMin();
  return {
    x: min[0],
    y: min[1],
    width: max[0] - min[0],
    height: max[1] - min[1],
  };
}
