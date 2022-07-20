import { DisplayObject } from '@antv/g';

export function applyStyle(shape: DisplayObject, idx: number, attrs: any[], style?: any) {
  const datum = attrs[idx].data;
  const data = attrs.map((d) => d.data);
  const labelStyle = typeof style === 'function' ? style.call(null, datum, idx, data) : style;
  shape.attr(labelStyle || {});
}
