import type { DisplayObject } from '@antv/g';
import { isNil } from '@antv/util';
import type { GUI } from '../core/gui';

/**
 * execute transition animation on element
 * @description in the current stage, only support the following properties:
 * x, y, width, height, opacity, fill, stroke, lineWidth, radius
 * @param el element to be animated
 * @param target target properties
 * @param options transition options
 * @param animate whether to animate
 * @param threshold threshold to determine whether to animate
 * @returns transition instance
 */
export function transition(
  el: DisplayObject | GUI<any>,
  target: { [key: string]: any },
  options: any = {},
  animate: boolean = true,
  threshold: number = 50
): Promise<any> {
  const from: typeof target = {};
  const to: typeof target = {};
  const supportProperties = ['x', 'y', 'width', 'height', 'opacity', 'radius'];
  Object.entries(target).forEach(([key, tarStyle]) => {
    const currStyle = el.attr(key);
    if (
      supportProperties.includes(key) &&
      !isNil(tarStyle) &&
      !isNil(currStyle) &&
      currStyle !== tarStyle &&
      Math.abs(+currStyle - +tarStyle) >= threshold
    ) {
      from[key] = currStyle;
      to[key] = tarStyle;
    }
  });

  const applyStyle = () => {
    if ('update' in el) el.update(target);
    else
      Object.keys(target).forEach((key) => {
        el.attr(key, target[key]);
      });

    return Promise.resolve();
  };

  if (!animate) return applyStyle();
  if (Object.keys(from).length > 0)
    return el.animate([from, to], { fill: 'both', ...options })?.finished.then(applyStyle) || Promise.resolve();

  return Promise.resolve();
}
