import { isString, isNumber } from 'lodash';
import type { DisplayObject } from '@antv/g';
import { Text } from '@antv/g';
import type { ExtendDisplayObject } from '../types';

export function renderExtDo(el: ExtendDisplayObject): DisplayObject {
  return isString(el) || isNumber(el)
    ? new Text({
        style: {
          text: String(el),
        },
      })
    : el;
}
