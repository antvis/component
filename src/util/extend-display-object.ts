import type { DisplayObject } from '@antv/g';
import { isNumber, isString } from '@antv/util';
import type { ExtendDisplayObject } from '../types';
import { Text } from '../ui/text';

export function renderExtDo(el: ExtendDisplayObject): DisplayObject {
  if (typeof el === 'function') return el();
  return isString(el) || isNumber(el)
    ? new Text({
        style: {
          text: String(el),
        },
      })
    : el;
}
