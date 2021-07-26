import { DisplayObject } from '@antv/g';
import { deepMix } from '@antv/util';
import { Marker } from '../marker';
import { LegendBase } from './base';
import { CategoryItem } from './category-item';
import type { CategoryCfg, CategoryOptions } from './types';
import { CATEGORY_DEFAULT_OPTIONS } from './constant';

export type { CategoryOptions };

export class Category extends LegendBase<CategoryCfg> {
  public static tag = 'Category';

  private itemsContainer: DisplayObject;

  // 图例项
  private items: CategoryItem[];

  // 前进按钮
  private prevNavigation: Marker;

  // 后退按钮
  private nextNavigation: Marker;

  protected static defaultOptions = {
    type: Category.tag,
    ...CATEGORY_DEFAULT_OPTIONS,
  };

  constructor(options: CategoryOptions) {
    super(deepMix({}, Category.defaultOptions, options));
  }

  attributeChangedCallback(name: string, value: any) {}

  public init() {}

  public update(attrs: CategoryCfg) {}

  public clear() {}

  protected getColor() {
    return 'red';
  }

  protected getBackgroundAttrs() {}

  private bindEvents() {
    // 图例项hover事件
    // 图例项点击事件
  }

  /**
   * 创建图例项
   */
  private createItems() {}

  /**
   * 获得一页图例项可用空间
   */
  private getItemsSpace() {
    /**
     * 情况1 按钮在上下、左右 无页码
     *            ↑
     *    item  item  item
     *  ← item  item  item →
     *    item  item  item
     *            ↓
     *
     * 情况2 按钮在内
     *    item  item  item
     *    item  item  <- ->
     *
     *    item  item  item
     *    item  <- 1/3 ->
     *
     * 情况3 按钮在外
     *       <- 1/3 ->
     *  ↑ item  item  item  ↑
     *1/3 item  item  item 1/3
     *  ↓ item  item  item  ↓
     *       <- 1/3 ->
     */
  }

  /**
   * 计算图例布局
   */
  private calcLayout() {}

  // 创建翻页器
  private createPageNavigator() {}

  // 前翻页
  private onNavigationPrev = () => {};

  // 后翻页
  private onNavigationNext = () => {};

  // 设置图例项状态
  private setItemStatus() {}
}
