import { isString, isNumber } from '@antv/util';
import type { DisplayObject } from '@antv/g';
import { Text } from '@antv/g';
import type { ExtendDisplayObject } from '../types';

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
