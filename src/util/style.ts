import type { TextStyleProps } from '@antv/g';
import { clone, deepMix, get, indexOf } from '@antv/util';
import type { MixAttrs, StyleState } from '../types';
import { STATE_LIST } from '../constant';

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
 * 从带状态样式中返回移除了状态样式的默认样式
 */
// @ts-ignore
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
// @ts-ignore
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

/**
 *
 * @param style
 * @param prefix
 * @param invert get the reset style
 * @returns
 */
export function subObject(style: { [keys: string]: any }, prefix: string, invert: boolean = false) {
  const startsWith = (str: string, prefix: string) => new RegExp(`^${prefix}[A-Z].*`).test(str);
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };
  return Object.keys(style).reduce((acc, curr) => {
    if (startsWith(curr, prefix) !== invert) {
      if (invert) acc[curr] = style[curr];
      else acc[capitalizeFirstLetter(curr.slice(prefix.length))] = style[curr];
    }
    return acc;
  }, {} as typeof style);
}

export function subObjects(style: any, prefix: string[]) {
  let internalStyle = style;
  const finalStyle = Object.keys(style).reduce((acc, curr, index) => {
    if (index >= prefix.length) return acc;
    const pre = prefix[index];
    acc.push(subObject(internalStyle, pre));
    internalStyle = subObject(internalStyle, pre, true);
    return acc;
  }, [] as typeof style[]);
  finalStyle.push(internalStyle);
  return finalStyle;
}

/**
 * add prefix to style
 * @param style
 * @param prefix
 */
export function prefixStyle(style: any, prefix: string) {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return Object.keys(style).reduce((acc, curr) => {
    acc[`${prefix}${capitalizeFirstLetter(curr)}`] = style[curr];
    return acc;
  }, {} as typeof style);
}

/**
 * extract group style from mixin style
 * @param style
 * @returns shape style and rest style
 */
export function styleSeparator(style: { [keys: string]: any }) {
  const ignoreStyleDict = ['x', 'y'];
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
