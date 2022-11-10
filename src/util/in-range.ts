import { inRange as _inRange } from 'lodash';

export function inRange(n: number, start: number, end: number, includeLeft?: boolean, includeRight?: boolean) {
  if ((includeLeft && n === start) || (includeRight && n === end)) return true;
  return _inRange(n, start, end);
}
