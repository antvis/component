import { clone, deepMix, get } from '@antv/util';
import { STATE_LIST } from '../constant';
import type { MixAttrs, StyleState } from '../types';

/**
 * 从带状态样式中返回移除了状态样式的默认样式
 */
export function getDefaultStyle<T>(style: MixAttrs<T> | undefined): T | undefined {
  if (style === undefined) ({} as T);
  if (style) {
    return style?.default;
  }
  const duplicateStyle = clone(style) || {};
  // 移除其他带状态的样式得到默认样式
  STATE_LIST.forEach((state) => {
    if (state in duplicateStyle) delete duplicateStyle[state];
  });
  return duplicateStyle as T;
}

/**
 * 对于格式为:
 * style: ShapeAttrs & {
 *  [state: string]?: ShapeAttrs,
 * }
 * 的带状态样式，根据状态提取出样式
 * 默认返回默认样式
 * @param style 混合样式
 * @param state 状态
 * @param isMerge 是否将状态样式与默认样式合并
 */
export function getStateStyle<T>(style?: MixAttrs<T>, state?: StyleState, isMerge: boolean = false): Partial<T> {
  if (!state) {
    const temp = getDefaultStyle(style);
    if (temp) return temp;
    return {};
  }
  const stateStyle = get(style, state) as T;
  if (isMerge) {
    return deepMix({}, getDefaultStyle(style), stateStyle);
  }
  return stateStyle;
}

/**
 * 对给定HTML对象应用给定样式
 * @param style {[key: string]: Object}
 * 样式表参考结构
 * {
 *  '.selector': {
 *   'attrName': 'attr',
 *   'padding': '0 0 0 0',
 *   'background-color': 'red'
 *  }
 * }
 */
export function applyStyleSheet(element: HTMLElement, style: { [key: string]: Object }): void {
  Object.entries(style).forEach(([selector, styleString]) => {
    [element, ...element.querySelectorAll(selector)]
      .filter((el) => el.matches(selector))
      .forEach((target) => {
        const temp = target as HTMLElement;
        temp.style.cssText += Object.entries(styleString).reduce((total, currVal) => {
          return `${total}${currVal.join(':')};`;
        }, '');
      });
  });
}
