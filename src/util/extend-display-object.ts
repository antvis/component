import type { ExtendDisplayObject } from '@/types';
import { isString, isNumber } from 'lodash';
import type { DisplayObject } from '@antv/g';
import { Text } from '@antv/g';

export function renderExtDo(el: ExtendDisplayObject): DisplayObject {
  return isString(el) || isNumber(el)
    ? new Text({
        style: {
          text: String(el),
        },
      })
    : el;
}
