import { IGroup } from '@antv/g-base/lib/interfaces';
import { AnimateCfg, Point, ShapeAttrs } from '@antv/g-base/lib/types';

export interface Range {
  start: Point;
  end: Point;
}

export interface Region extends Range {
  tl?: Point;
  br?: Point;
  width?: number;
  height?: number;
}
/**
 * @interface
 * 列表选项接口
 */
export interface ListItem {
  /**
   * 唯一值，用于动画或者查找
   * @type {string}
   */
  id?: string;
  /**
   * 名称
   * @type {string}
   */
  name: string;
  /**
   * 值
   * @type {any}
   */
  value: any;
  /**
   * 图形标记
   * @type {object|string}
   */
  marker?: object | string;
  [key: string]: any;
}

/**
 * @interface
 * 栅格项的定义
 */
export interface GridItem {
  /**
   * 唯一值，用于动画或者查找
   * @type {string}
   */
  id?: string;
  /**
   * 栅格线的点集合
   * @type {Point[]}
   */
  points: Point[];
  [key: string]: any;
}

/**
 * @interface
 * 坐标轴线定义
 */
export interface AxisLineCfg {
  /**
   * 坐标轴线的配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}

/**
 * @interface
 * 坐标轴刻度定义
 */
export interface AxisTickLineCfg {
  /**
   * 坐标轴刻度线的配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
  /**
   * 是否同 tick 对齐
   * @type {boolean}
   */
  alignTick: boolean; // 是否同 tick 对齐
  /**
   * 长度
   * @type {number}
   */
  length: number;
}

/**
 * @interface
 * 坐标轴文本定义
 */
export interface AxisLabelCfg {
  /**
   * 坐标轴文本的样式
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
  /**
   * 是否自动旋转，默认 true
   * @type {boolean}
   */
  autoRotate: boolean;
  /**
   * 是否自动隐藏，默认 true
   * @type {boolean}
   */
  autoHide: boolean;
}

/**
 * @interface
 * 坐标轴子刻度定义
 */
export interface AxisSubTickLineCfg {
  /**
   * 坐标轴刻度线的配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
  /**
   * 子刻度个数
   * @type {number}
   */
  count: number;
  /**
   * 子刻度线长度
   * @type {number}
   */
  length: number;
}

/**
 * @interface
 * 坐标轴标题定义
 */
export interface AxisTitleCfg {
  /**
   * 标题距离坐标轴的距离
   * @type {number}
   */
  offset: number;
  /**
   * 标题文本配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
  /**
   * 是否自动旋转
   * @type {boolean}
   */
  autoRotate: boolean;
}

export interface BaseCfg {
  [key: string]: any;
}

export interface ComponentCfg extends BaseCfg {
  /**
   * 唯一标定组件的 id
   * @type {string}
   */
  id?: string;
  /**
   * 组件名称， axis, legend, tooltip
   * @type {string}
   */
  name?: string;
  /**
   * 组件的类型，同 name 配合使用可以确定具体组件的类型，例如：
   *  name: 'axis',
   *  type: 'line'
   */
  type?: string;
  /**
   * 是否允许动画，不同组件允许动画的内容不同
   * @type {boolean}
   */
  animate?: boolean;
  /**
   * 动画的配置项
   * @type {AnimateCfg}
   */
  animateCfg?: AnimateCfg;
  /**
   * 事件对象，可以在配置项中传入事件
   * @example
   * events: {
   *   itemclick: ev => {
   *
   *   }
   * }
   * // 等效于
   * component.on('itemclick', ev => {
   *
   * });
   * @type {object}
   */
  events?: object;
  /**
   * @protected
   * 配置项生效时的默认值，一些配置项是对象时，防止将一些内置的配置项清空，减少判空判断
   * @example
   * new Axis({
   *   tickLine: {
   *     length: 10 // 此时没有设置 style，内部调用 tickLine.style 时会出问题
   *   }
   * })
   * @type {object}
   */
  defaultCfg?: object;
}

export interface GroupComponentCfg extends ComponentCfg {
  /**
   * 组件的容器
   * @type {IGroup}
   */
  container: IGroup;
  /**
   * 当前组件对应的 group，一个 container 中可能会有多个组件，但是一个组件都有一个自己的 Group
   * @type {IGroup}
   */
  group?: IGroup;
  /**
   * 组件是否可以被拾取
   * @type {boolean}
   */
  capture?: boolean;
}

export interface HtmlComponentCfg extends ComponentCfg {
  /**
   * 组件的 DOM 容器
   * @type {HTMLElement|string}
   */
  container?: HTMLElement | string;
  parent?: HTMLElement | string;
}

export interface AxisBaseCfg extends ComponentCfg {
  /**
   * 坐标轴刻度的集合
   * @type {ListItem[]}
   */
  ticks: ListItem[];
  /**
   * 坐标轴线的配置项
   * @type {AxisLineCfg}
   */
  line?: AxisLineCfg;
  /**
   * 坐标轴刻度线线的配置项
   * @type {AxisTickLineCfg}
   */
  tickLine?: AxisTickLineCfg;
  /**
   * 坐标轴子刻度线的配置项
   * @type {AxisSubTickLineCfg}
   */
  subTickLine?: AxisSubTickLineCfg;
  /**
   * 标题的配置项
   * @type {AxisTitleCfg}
   */
  title?: AxisTitleCfg;
  /**
   * 文本标签的配置项
   */
  label?: AxisLabelCfg;
  /**
   * 垂直于坐标轴方向的因子，决定文本、title、tickLine 在坐标轴的哪一侧
   */
  verticalFactor?: number;
}

export interface LineAxisCfg extends AxisBaseCfg {
  /**
   * 坐标轴的起始点
   * @type {Point}
   */
  start: Point;
  /**
   * 坐标轴的结束点
   * @type {Point}
   */
  end: Point;
}

export interface CircleAxisCfg extends AxisBaseCfg {
  /**
   * 中心点, x, y
   * @type {Point}
   */
  center: Point;
  /**
   * 半径
   * @type {number}
   */
  radius: number;
  /**
   * 开始弧度
   * @type {number}
   */
  startAngle?: number;
  /**
   * 结束弧度
   * @type {number}
   */
  endAngle?: number;
}

export interface GridLineCfg {
  /**
   * 栅格线的类型
   * @type {string}
   */
  type?: string;
  /**
   * 栅格线的配置项
   * @type {ShapeAttrs}
   */
  style?: ShapeAttrs;
}

export interface GridBaseCfg extends GroupComponentCfg {
  /**
   * 线的样式
   * @type {object}
   */
  line?: GridLineCfg;
  /**
   * 两个栅格线间的填充色，必须是一个数组
   * @type {string|string[]}
   */
  alternateColor?: string | string[];
  /**
   * 绘制 grid 需要的点的集合
   * @type {GridItem[]}
   */
  items: GridItem[];
  /**
   * 栅格线是否封闭
   * @type {boolean}
   */
  closed?: boolean;
}

export interface CircleGridCfg extends GridBaseCfg {
  /**
   * 中心点
   * @type {Point}
   */
  center: Point;
}

export interface CategoryLegendCfg extends GroupComponentCfg {
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
   * 位置 x
   * @type {number}
   */
  offsetX?: number;
  /**
   * 位置 y
   * @type {number}
   */
  offsetY?: number;
  /**
   * 标题
   * @type {LegendTitleCfg}
   */
  title?: LegendTitleCfg;
  /**
   * 背景框配置项
   * @type {LegendBackgroundCfg}
   */
  backgroud?: LegendBackgroundCfg;
  /**
   * 图例项水平方向的间距
   * @type {number}
   */
  itemSpacing?: number;
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
}

export interface LegendTitleCfg {
  /**
   * 标题同图例项的间距
   * @type {number}
   */
  spacing: number;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}

export interface LegendBackgroundCfg {
  /**
   * @type {number|number[]}
   * 背景的留白
   */
  padding: number | number[];
  /**
   * @type {ShapeAttrs}
   * 背景配置项
   */
  style: ShapeAttrs;
}

export interface LegendItemNameCfg {
  /**
   * 图例项 name 同后面 value 的间距
   * @type {number}
   */
  spacing: number;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}

type formatterCallback = (text: string, item: ListItem, index: number) => any;

export interface LegendItemValueCfg {
  /**
   * 是否右对齐，默认为 false，仅当设置图例项宽度时生效
   * @type {boolean}
   */
  alignRight: boolean;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 图例项附加值的配置
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}

export interface LegendMarkerCfg {
  /**
   * 图例项 marker 同后面 name 的间距
   * @type {number}
   */
  spacing: number;
  /**
   * 图例项 marker 的配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}

export interface TooltipCfg extends HtmlComponentCfg {
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
   * 列表项集合
   * @type {ListItem[]}
   */
  items: ListItem[];
  /**
   * 容器的模板
   * @type {string}
   */
  containerTpl?: string;
  /**
   * 列表项的模板
   * @type {[type]}
   */
  itemTpl?: string;
  /**
   * 根据 x 定位的 crosshair 的模板
   * @type {string}
   */
  xCrosshairTpl?: string;
  /**
   * 根据 y 定位的 crosshair 的模板
   * @type {[type]}
   */
  yCrosshairTpl?: string;
  /**
   * tooltip 限制的区域
   * @type {Range}
   */
  region?: Region;
  /**
   * crosshairs 限制的区域
   * @type {Range}
   */
  crosshairsRegion?: Region;
  /**
   * crosshairs 的类型， x,y,xy
   * @type {string}
   */
  crosshairs?: string;
  /**
   * 是否跟随鼠标移动，会影响 x，y的定位
   * @type {boolean}
   */
  follow?: boolean;
  /**
   * 偏移量，同 position 相关
   * @type {number}
   */
  offset?: number;
  /**
   * 位置，top, bottom, left, right
   * @type {string}
   */
  position?: string;
  /**
   * 传入各个 dom 的样式
   * @type {object}
   */
  domStyles?: object;
  /**
   * 默认的各个 dom 的样式
   * @type {object}
   */
  defaultStyles?: object;
}
