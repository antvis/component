import type { DisplayObject } from '@antv/g';
import { isNil } from '@antv/util';
import type { GenericAnimation } from '../animation';
import type { GUI } from '../core/gui';

/**
 * execute transition animation on element
 * @description in the current stage, only support the following properties:
 * x, y, width, height, opacity, fill, stroke, lineWidth, radius
 * @param el element to be animated
 * @param target target properties
 * @param options transition options
 * @param animate whether to animate
 * @returns transition instance
 */
export function transition(el: DisplayObject | GUI<any>, target: { [key: string]: any }, options: GenericAnimation) {
  const from: typeof target = {};
  const to: typeof target = {};
  Object.entries(target).forEach(([key, tarStyle]) => {
    const currStyle = el.attr(key);
    if (!isNil(tarStyle) && !isNil(currStyle) && currStyle !== tarStyle) {
      from[key] = currStyle;
      to[key] = tarStyle;
    }
  });

  if (!options) {
    if ('update' in el) el.update(target);
    else el.attr(target);
    return null;
  }

  if (Object.keys(from).length > 0) {
    return el.animate([from, to], { fill: 'both', ...options });
  }

  return null;
}
