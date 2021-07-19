import { clone, deepMix, get } from '@antv/util';
import type { ShapeAttrs } from '@antv/g';
import type { MixAttrs, StyleState } from '../types';
import { STATE_LIST } from '../constant';

/**
 * 从带状态样式中返回移除了状态样式的默认样式
 */
export function getDefaultStyle(style: MixAttrs): ShapeAttrs {
  if ('default' in style) {
    return style.default;
  }
  const duplicateStyle = clone(style);
  // 移除其他带状态的样式得到默认样式
  STATE_LIST.forEach((state) => {
    if (state in duplicateStyle) delete duplicateStyle[state];
  });
  return duplicateStyle as ShapeAttrs;
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
export function getStateStyle(style: MixAttrs, state?: StyleState, isMerge: boolean = false): ShapeAttrs {
  if (!state) {
    return getDefaultStyle(style);
  }
  const stateStyle = get(style, state);
  if (isMerge) {
    return deepMix({}, getDefaultStyle(style), stateStyle);
  }
  return stateStyle;
}
