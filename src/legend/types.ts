/**
 * @file typings of legend
 */
import { ShapeAttrs } from '@antv/g-base';
import { formatterCallback, GroupComponentCfg, ListItem } from '../types';

export interface LegendBaseCfg extends GroupComponentCfg {
  /**
   * 布局方式： horizontal，vertical
   * @type {String}
   */
  layout?: string;
  /**
   * 位置 x
   * @type {number}
   */
  x?: number;
  /**
   * 位置 y
   * @type {number}
   */
  y?: number;
  /**
   * 标题
   * @type {LegendTitleCfg}
   */
  title?: LegendTitleCfg;
  /**
   * 背景框配置项
   * @type {LegendBackgroundCfg}
   */
  background?: LegendBackgroundCfg;
}
export interface CategoryLegendCfg extends LegendBaseCfg {
  /**
   * 图例项水平方向的间距
   * @type {number}
   */
  itemSpacing?: number;
  /**
   * 图例项的最大宽度，默认为 null，由上层传入
   */
  maxItemWidth?: number;
  /**
   * 图例项的宽度, 默认为 null，自动计算
   * @type {number}
   */
  itemWidth?: number;
  /**
   * 图例的高度，默认为 null
   * @type {[type]}
   */
  itemHeight?: number;
  /**
   * 图例项 name 文本的配置
   * @type {LegendItemNameCfg}
   */
  itemName?: LegendItemNameCfg;
  /**
   * 图例项 value 附加值的配置项
   * @type {LegendItemValueCfg}
   */
  itemValue?: LegendItemValueCfg;
  /**
   * 最大宽度
   * @type {number}
   */
  maxWidth?: number;
  /**
   * 最大高度
   * @type {number}
   */
  maxHeight?: number;
  /**
   * 图例项的 marker 图标的配置
   * @type {LegendMarkerCfg}
   */
  marker?: LegendMarkerCfg;
  /**
   * 图例项集合
   * @type {ListItem[]}
   */
  items: ListItem[];
  /**
   * 分页器配置
   * @type {LegendPageNavigatorCfg}
   */
  flipNavigation: LegendPageNavigatorCfg;
}

export interface ContinueLegendCfg extends LegendBaseCfg {
  /**
   * 选择范围的最小值
   * @type {number}
   */
  min: number;
  /**
   * 选择范围的最大值
   * @type {number}
   */
  max: number;
  /**
   * 选择的值
   * @type {number[]}
   */
  value: number[];
  /**
   * 图例的颜色，可以写多个颜色
   * @type {number[]}
   */
  colors: number[];
  /**
   * 选择范围的色块配置项
   * @type {ContinueLegendTrackCfg}
   */
  track: ContinueLegendTrackCfg;
  /**
   * 图例滑轨（背景）的配置项
   * @type {ContinueLegendRailCfg}
   */
  rail: ContinueLegendRailCfg;
  /**
   * 文本的配置项
   * @type {ContinueLegendLabelCfg}
   */
  label: ContinueLegendLabelCfg;
  /**
   * 滑块的配置项
   * @type {ContinueLegendHandlerCfg}
   */
  handler: ContinueLegendHandlerCfg;
  /**
   * 是否可以滑动
   * @type {boolean}
   */
  slidable: boolean;
}

export interface ContinueLegendTrackCfg {
  /**
   * 选定范围的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ContinueLegendHandlerCfg {
  /**
   * 滑块大小
   * @type {number}
   */
  size?: number;
  /**
   * 滑块样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ContinueLegendRailCfg {
  /**
   * rail 的类型，color, size
   * @type {string}
   */
  type?: string;
  /**
   * 滑轨的宽度
   * @type {number}
   */
  size?: number;
  /**
   * 滑轨的默认长度，，当限制了 maxWidth,maxHeight 时，不会使用这个属性会自动计算长度
   * @type {number}
   */
  defaultLength?: number;
  /**
   * 滑轨的样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface ContinueLegendLabelCfg {
  /**
   * 文本同滑轨的对齐方式，有五种类型
   *  - rail ： 同滑轨对齐，在滑轨的两端
   *  - top, bottom: 图例水平布局时有效
   *  - left, right: 图例垂直布局时有效
   * @type {string}
   */
  align?: string;
  /**
   * 文本格式化
   * @type {string}
   */
  formatter?: (text: string | number | null) => string;
  /**
   * 文本同滑轨的距离
   * @type {number}
   */
  spacing?: number;
  /**
   * 文本样式
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LegendTitleCfg {
  /**
   * 标题同图例项的间距
   * @type {number}
   */
  spacing?: number;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LegendBackgroundCfg {
  /**
   * @type {number|number[]}
   * 背景的留白
   */
  padding?: number | number[];
  /**
   * @type {ShapeAttrs}
   * 背景配置项
   */
  style?: ShapeAttrs;
}

export interface LegendItemNameCfg {
  /**
   * 图例项 name 同后面 value 的间距
   * @type {number}
   */
  spacing?: number;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LegendItemValueCfg {
  /**
   * 是否右对齐，默认为 false，仅当设置图例项宽度时生效
   * @type {boolean}
   */
  alignRight?: boolean;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 图例项附加值的配置
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface LegendMarkerCfg {
  /**
   * 图例项 marker 同后面 name 的间距
   * @type {number}
   */
  spacing?: number;
  /**
   * 图例 marker 形状
   */
  symbol?: string | ((x: number, y: number, r: number) => any);
  /**
   * 图例项 marker 的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

/**
 * 图例导航器，代指分页器
 */
export interface LegendPageNavigatorCfg {
  marker?: {
    style?: {
      /** 分页导航器 icon 填充色, 默认 #000 */
      fill?: string;
      /** 分页导航器 icon 填充色 透明度, 默认 1 */
      opacity?: number;
      /** 分页导航器 icon 非激活时的填充色 */
      inactiveFill?: string;
      /** 分页导航器 icon 非激活时的填充色 透明度, 默认 0.45 */
      inactiveOpacity?: number;
      /** 分页器的大小 */
      size?: number;
    };
  };
  text?: {
    style?: {
      /** 分页导航器 文本 填充色，默认 #ccc */
      fill?: string;
      /** 字体大小, 默认 12px */
      fontSize?: number;
    };
  };
}
