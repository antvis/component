import { isFunction } from 'lodash';

export function getCallbackValue<T = any>(value: any, params: any[]): T {
  return isFunction(value) ? value(...params) : value;
}
