import type { DisplayObject } from '@antv/g';
import type { GenericAnimation } from '.';

export default function (element: DisplayObject, options: GenericAnimation) {
  if (!options) {
    element.attr('opacity', 0);
    return { finished: Promise.resolve() };
  }
  return element.animate([{ opacity: 0 }, { opacity: 1 }], options);
}
