import { Text, DisplayObject, TextStyleProps } from '@antv/g';
import { Vector2 } from '../types';
import { select } from './selection';

/**
 * 获得图形的x、y、width、height
 */
export function getShapeSpace(shape: DisplayObject) {
  const bounds = shape && shape.getRenderBounds();
  if (!bounds)
    return {
      width: 0,
      height: 0,
    };
  const max = bounds.getMax();
  const min = bounds.getMin();
  return {
    width: max[0] - min[0],
    height: max[1] - min[1],
  };
}

export function getLocalBBox(shape: DisplayObject) {
  const { min, max } = shape.getLocalBounds();
  const [[x1, y1], [x2, y2]] = [min, max];
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1, left: x1, bottom: y2, top: y1, right: x2 };
}

export function createTempText(group: DisplayObject, attrs: TextStyleProps): Text {
  const textNode = select(group).append('text').node() as Text;
  textNode.attr({ ...attrs, visibility: 'hidden' });

  return textNode;
}

export function distance(p1: Vector2, p2: Vector2): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
