import { DisplayObject } from '@antv/g';

export function applyStyle(shape: DisplayObject, idx: number, style?: any) {
  const { data } = shape.style;
  const labelStyle = typeof style === 'function' ? style.call(null, data, idx) : style;
  shape.attr(labelStyle || {});
}
