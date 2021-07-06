import { DisplayObject, ShapeAttrs } from '../types';

/**
 * 对 Group 中名为 shape 的 DisplayObject 对象应用 attrs 中的属性
 * @param group
 * @param shape
 * @param attrs
 */
export function applyAttrs(target: DisplayObject, attrs: ShapeAttrs) {
  Object.entries(attrs).forEach(([attrName, attrValue]) => {
    target.setAttribute(attrName, attrValue);
  });
}

/**
 * 平台判断
 */
export function isPC(userAgent = undefined) {
  const userAgentInfo = userAgent || navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  Agents.forEach((item) => {
    if (userAgentInfo.indexOf(item) > 0) {
      flag = false;
    }
  });
  return flag;
}
