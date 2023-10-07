import { isNumber, isString } from '@antv/util';
import type { DisplayObject } from '../shapes';
import { Text } from '../shapes';
import type { ExtendDisplayObject } from '../types';

export function renderExtDo(el: ExtendDisplayObject): DisplayObject {
  if (typeof el === 'function') return el();
  return isString(el) || isNumber(el) ? new Text({ style: { text: String(el) } }) : el;
}
