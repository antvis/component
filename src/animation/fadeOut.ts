import type { DisplayObject } from '@antv/g';
import { transition } from '../util';
import type { GenericAnimation } from '.';

export default function (element: DisplayObject, options: GenericAnimation) {
  return transition(element, { opacity: 0 }, options);
}
