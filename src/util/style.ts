import type { TextStyleProps } from '@antv/g';
import { clone, deepMix, get } from '@antv/util';
import { STATE_LIST } from '../constant';
import type { MixAttrs, StyleState } from '../types';
import type { PrefixStyleProps } from '../core';
import { toUppercaseFirstLetter, toLowercaseFirstLetter, addPrefix, removePrefix } from './string';

/**
 * 以下属性都是可继承的，这意味着没有显式定义（值为 unset）时，是需要从未来的祖先节点中计算得到的。
 * 因此 Text 在创建之后立刻调用 getBounds 等方法获取包围盒是不准确的（例如 getShapeSpace 方法）。
 *
 * 目前 GUI 里这么做通常是为了布局。但理想的做法是使用布局属性（例如 BoxFlow 中的 margin / padding，Flex 布局的 flex 等），
 * 正如在浏览器中我们很少使用 getBoundingClientRect 而更多使用 `display: block/flex/grids`，
 * 这样可以避免手动计算（如何计算以及计算时机只有 浏览器/G 最清楚）。
 *
 * 暂时在布局实现前，先通过显式定义的值绕开该问题，当然这也放弃了继承特性（例如根节点上的 fontSize 修改也影响不到了）。
 *
 * 继承机制 & 默认值 @see https://g-next.antv.vision/zh/docs/api/css/inheritance
 */
export const TEXT_INHERITABLE_PROPS: Pick<
  TextStyleProps,
  'fontSize' | 'fontFamily' | 'fontWeight' | 'fontVariant' | 'fontStyle' | 'textAlign' | 'textBaseline'
> = {
  fontSize: '16px',
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
  fontVariant: 'normal',
  fontStyle: 'normal',
  textAlign: 'start',
  textBaseline: 'alphabetic',
};

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
    // apply styles to element and children
    [element, ...element.querySelectorAll(selector)]
      .filter((el) => el.matches(selector))
      .forEach((target) => {
        if (!target) return;
        const temp = target as HTMLElement;
        temp.style.cssText += Object.entries(styleString).reduce((total, currVal) => {
          return `${total}${currVal.join(':')};`;
        }, '');
      });
  });
}

const reserveProperty = ['data', 'layout', 'events', 'style', 'animation', 'interactions'];

/**
 *
 * @param style
 * @param prefix
 * @param invert get the reset style
 * @param transform enable filter transform
 * @returns
 */
export function subObject(style: Record<string, any>, prefix: string, invert: boolean = false) {
  return Object.keys(style).reduce((acc, curr) => {
    if (curr.startsWith(prefix) !== invert) {
      if (invert) acc[curr] = style[curr];
      else acc[removePrefix(curr, prefix)] = style[curr];
    }
    return acc;
  }, {} as typeof style);
}

export function subStyleProps<T = Record<string, any>>(
  style: Record<string, any>,
  prefix: string,
  invert: boolean = false
) {
  const result: Record<string, any> = {};
  Object.entries(style).forEach(([key, value]) => {
    // never tranfer class property
    if (key === 'class') {
      // do nothing
    }
    // @example style: { labelStroke: 'red' } -> style: { stroke: 'red }
    else if (reserveProperty.includes(key)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const object = subObject(value, prefix, invert);
        // @example data: { sparklineData: [] } -> data: []
        //                                 ⬇️------------⬆️
        if (key === 'data' && Object.keys(object).length === 1 && (Object.keys(object)[0] === 'data') !== invert)
          result[key] = object.data;
        else result[key] = object;
      } else result[key] = value;
    }
    // @example showHandle -> showHandle, showHandleLabel -> showLabel
    else if (key.startsWith(addPrefix(prefix, 'show')) !== invert) {
      if (key === addPrefix(prefix, 'show')) result[key] = value;
      else result[key.replace(new RegExp(toUppercaseFirstLetter(prefix)), '')] = value;
    }
    // @example navFormatter -> formatter
    else if (key.startsWith(prefix) !== invert) {
      result[removePrefix(key, prefix)] = value;
    }
  });
  return result as T;
}

export function subObjects(style: any, prefix: string[]) {
  let internalStyle = style;
  const finalStyle = Object.keys(style).reduce((acc, curr, index) => {
    if (index >= prefix.length) return acc;
    const pre = prefix[index];
    acc.push(subStyleProps(internalStyle, pre));
    internalStyle = subStyleProps(internalStyle, pre, true);
    return acc;
  }, [] as (typeof style)[]);
  finalStyle.push(internalStyle);
  return finalStyle;
}

/**
 * add prefix to style
 * @param style
 * @param prefix
 */
export function superObject(style: Record<string, any>, prefix: string) {
  return Object.keys(style).reduce((acc, curr) => {
    acc[addPrefix(curr, prefix)] = style[curr];
    return acc;
  }, {} as typeof style);
}

export function superStyleProps<T extends Record<string, any>, P extends string>(
  style: T,
  prefix: P
): PrefixStyleProps<T, P> {
  const result: Record<string, any> = {};
  Object.entries(style).forEach(([key, value]) => {
    if (key.startsWith('show')) result[key] = value;
    else if (reserveProperty.includes(key)) result[key] = superObject(value, prefix);
  });
  return result as PrefixStyleProps<T, P>;
}

/**
 * extract group style from mixin style
 * @param style
 * @param ignoreStyleDict style will be ignore from style
 * @returns shape style and rest style
 */
export function styleSeparator(style: { [keys: string]: any }, ignoreStyleDict: string[] = ['x', 'y', 'class']) {
  const groupStyleDict: string[] = [
    'transform',
    'transformOrigin',
    'anchor',
    'visibility',
    'pointerEvents',
    'zIndex',
    'cursor',
    'clipPath',
    'clipPathTargets',
    'offsetPath',
    'offsetPathTargets',
    'offsetDistance',
    'draggable',
    'droppable',
  ];
  const output: typeof style = {};
  const groupStyle: typeof style = {};
  Object.entries(style).forEach(([key, val]) => {
    if (ignoreStyleDict.includes(key)) {
      // do nothing
    } else if (groupStyleDict.indexOf(key) !== -1) groupStyle[key] = val;
    else output[key] = val;
  });
  return [output, groupStyle];
}
