import { isFunction } from '@antv/util';
import { RequiredStyleProps } from '../../../core';
import type { CallbackableObject } from '../../../types';
import { getCallbackValue } from '../../../util';
import type { AxisDatumCP, AxisStyleProps } from '../types';

export function getCallbackStyle<T extends { [keys: string]: any }>(
  style: CallbackableObject<T, AxisDatumCP>,
  params: AxisDatumCP
) {
  return Object.fromEntries(
    Object.entries(style).map(([key, val]) => {
      return [key, getCallbackValue(val as any, params)];
    })
  );
}

export function baseDependencies(attr: RequiredStyleProps<AxisStyleProps>): any[] {
  if (attr.style.type === 'linear') {
    const { startPos, endPos } = attr.style;
    return [...startPos, ...endPos];
  }
  const { startAngle, endAngle, center, radius } = attr.style;
  return [startAngle, endAngle, ...center, radius];
}

export function filterExec<T>(data: T[], filter?: (...args: any) => boolean): T[] {
  return !!filter && isFunction(filter) ? data.filter(filter) : data;
}
