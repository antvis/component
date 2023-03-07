import { isFunction } from '@antv/util';
import type { CallbackableObject } from '../../../types';
import { getCallbackValue } from '../../../util';
import type { AxisDatumCP, AxisStyleProps } from '../types';

export function getCallbackStyle<T extends { [keys: string]: any }, P extends Array<any> = []>(
  style: CallbackableObject<T, AxisDatumCP<P>>,
  params: AxisDatumCP<P>
) {
  return Object.fromEntries(
    Object.entries(style).map(([key, val]) => {
      return [key, getCallbackValue(val as any, params)];
    })
  );
}

export function baseDependencies(attr: Required<AxisStyleProps>): any[] {
  if (attr.type === 'linear') {
    const { startPos, endPos } = attr;
    return [...startPos, ...endPos];
  }
  const { startAngle, endAngle, center, radius } = attr;
  return [startAngle, endAngle, ...center, radius];
}

export function filterExec<T>(data: T[], filter?: (...args: any) => boolean): T[] {
  return !!filter && isFunction(filter) ? data.filter(filter) : data;
}
