import type { DisplayObject } from '@antv/g';
import { CustomEvent, Group } from '@antv/g';
import { clone, deepMix, isFunction } from '@antv/util';
import { Marker } from '../marker';
import { LegendBase } from './base';
import { CategoryItem } from './category-item';
import { getShapeSpace } from '../../util';
import { CATEGORY_DEFAULT_OPTIONS } from './constant';
import type { StyleState } from '../../types';
import type { CategoryCfg, CategoryOptions } from './types';
import type { ICategoryItemCfg, IItemText } from './category-item';

export type { CategoryOptions };

export class Category extends LegendBase<CategoryCfg> {
  public static tag = 'Category';

  private itemsGroup!: Group;

  // 前进按钮
  private prevNavigation!: Marker;

  // 后退按钮
  private nextNavigation!: Marker;

  protected static defaultOptions = {
    type: Category.tag,
    ...CATEGORY_DEFAULT_OPTIONS,
  };

  constructor(options: CategoryOptions) {
    super(deepMix({}, Category.defaultOptions, options));
    super.init();
    this.init();
  }

  public init() {
    this.createItemsGroup();
    this.createItems();
    this.createPageNavigator();
    this.adjustLayout();
    this.createBackground();
    this.bindEvents();
  }

  public update(cfg: Partial<CategoryCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    super.update();
    // 对于items的变化目前进行重绘操作，后期可参考React Diff方法进行性能优化
    // if ('items' in style) {
    this.clearItems();
    this.createItems();
    // }
    this.adjustLayout();
    this.backgroundShape.attr(this.getBackgroundShapeCfg());
  }

  /**
   * 根据id获取item
   */
  public getItem(id: string): CategoryItem {
    const items = this.getItems();
    let item!: CategoryItem;
    items.forEach((i) => {
      if (i.getID() === id) {
        item = i;
      }
    });
    return item;
  }

  /**
   * 设置某个item的状态
   * 会改变其样式
   */
  public setItemState(name: string, state: StyleState) {
    this.getItem(name).setState(state);
  }

  /**
   * 获得items状态列表
   */
  public getItemsStates(): { id: string; state: StyleState }[] {
    const items = this.getItems();
    return items.map((item) => {
      return { id: item.getID(), state: item.getState() };
    });
  }

  public clear() {}

  protected getBackgroundShapeCfg() {
    const { width, height } = getShapeSpace(this);
    return {
      width,
      height,
      ...this.getStyle('backgroundStyle'),
    };
  }

  private createItemsGroup() {
    this.itemsGroup = new Group({
      name: 'itemsGroup',
    });
    this.appendChild(this.itemsGroup);
  }

  private getItemsShapeCfg() {
    const {
      items: _items,
      itemWidth,
      maxItemWidth,
      itemMarker,
      itemName,
      itemValue,
      itemBackgroundStyle,
      reverse,
    } = this.attributes;
    const cfg: ICategoryItemCfg[] = [];
    const items = clone(_items) as CategoryCfg['items'];
    if (reverse) items.reverse();

    items.forEach((item, idx) => {
      const { state = 'default', name: nameContent = '', value: valueContent = '', id } = item;
      cfg.push({
        x: 0,
        y: 0,
        state,
        itemWidth,
        maxItemWidth,
        // 这里使用name-idx作为id
        identify: id !== undefined ? id : `${nameContent}-${idx}`,
        itemMarker: isFunction(itemMarker) ? itemMarker(item, idx, items) : itemMarker,
        itemName: (() => {
          const { formatter, style, spacing } = isFunction(itemName) ? itemName(item, idx, items) : itemName;
          return {
            style,
            spacing,
            content: formatter!(nameContent),
          } as IItemText;
        })(),
        itemValue: (() => {
          const { formatter, style, spacing } = isFunction(itemValue) ? itemValue(item, idx, items) : itemValue;
          return {
            style,
            spacing,
            content: formatter!(valueContent),
          } as IItemText;
        })(),
        backgroundStyle: isFunction(itemBackgroundStyle) ? itemBackgroundStyle(item, idx, items) : itemBackgroundStyle,
      });
    });
    return cfg;
  }

  /**
   * 创建图例项
   */
  private createItems() {
    const itemsCfg = this.getItemsShapeCfg();
    itemsCfg.forEach((cfg) => {
      const item = new CategoryItem({
        style: cfg,
        name: 'item',
      });
      this.itemsGroup.appendChild(item);
    });
  }

  private getItems() {
    return this.itemsGroup.children as CategoryItem[];
  }

  private clearItems() {
    this.getItems().forEach((child) => child.destroy());
    this.itemsGroup.removeChildren();
  }

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

  // 创建翻页器
  private createPageNavigator() {}

  // 前翻页
  private onNavigationPrev = () => {};

  // 后翻页
  private onNavigationNext = () => {};

  // 设置图例项状态
  private setItemStatus() {}

  private bindEvents() {
    // 图例项hover事件
    // 图例项点击事件
    // 翻页按钮点击事件
    // 找到node节点所在的CategoryItem节点
    const getParentItem = (node: DisplayObject) => {
      let item = node;
      while (item.getConfig().type !== 'categoryItem') {
        item = item.parentNode!;
        if (!item) break;
      }
      return item as CategoryItem;
    };

    this.itemsGroup.addEventListener('click', (e) => {
      const { target } = e;
      if (target) {
        const item = getParentItem(target as DisplayObject); // (target as DisplayObject).parentNode.parentNode as CategoryItem;
        if (!item) return;
        const state = item.getState();
        if (!['selected', 'selected-active'].includes(state)) {
          item.setState('selected-active');
        } else {
          item.setState('default-active');
        }
        const evt = new CustomEvent('valuechange', {
          detail: {
            value: this.getItemsStates(),
          },
        });
        this.dispatchEvent(evt);
      }
    });

    this.itemsGroup.addEventListener('mousemove', (e) => {
      const { target } = e;
      if (target) {
        const item = getParentItem(target as DisplayObject);
        if (!item) {
          this.getItems().forEach((item) => {
            item.onUnHover();
          });
          return;
        }
        const state = item.getState();
        if (state !== 'active') {
          this.getItems().forEach((item) => {
            item.onUnHover();
          });
          item.onHover();
        }
      }
    });

    this.itemsGroup.addEventListener('mouseleave', (e) => {
      this.getItems().forEach((item) => {
        item.onUnHover();
      });
    });
  }

  /**
   * 计算图例布局
   * https://www.yuque.com/antv/zb50wl/gzc4sg
   */
  private adjustLayout() {
    const { orient } = this.attributes;
    if (orient === 'horizontal') this.adjustHorizontal();
    else this.adjustVertical();
  }

  /**
   * 横向布局
   */
  private adjustHorizontal() {
    const {
      maxWidth,
      spacing: [row, col],
      autoWrap,
      maxCols,
    } = this.attributes;
    const { x: left, y: top } = this.getAvailableSpace();

    if (!maxWidth) {
      // 不限制宽度，一行拉通
      //  item item item item item
      let prevWidth = left;
      this.getItems().forEach((item) => {
        item.attr('x', prevWidth);
        prevWidth += getShapeSpace(item).width + row;
      });
    }
    if (!autoWrap) {
      // <- item item item item ->
      // 不允许自动换行，【若超出宽度】横向出现翻页按钮
      // 调整 itemsGroup 位置
      // 调整翻页器位置
    }
    // 换行
    let prevWidth = left;
    let prevHeight = top;
    this.getItems().forEach((item) => {
      const { width, height } = getShapeSpace(item);
      if (prevWidth >= maxWidth) {
        prevHeight += height + col;
        prevWidth = left;
      }
      item.attr({ x: prevWidth, y: prevHeight });
      prevWidth += width + row;
    });

    // 超出最大行数
  }

  private adjustVertical() {
    const {
      maxHeight,
      spacing: [row, col],
      autoWrap,
      maxRows,
      itemWidth,
    } = this.attributes;
    const { x: left, y: top } = this.getAvailableSpace();
    if (!maxHeight) {
      // 不限制高度，一列拉通
      let prevHeight = top;
      this.getItems().forEach((item) => {
        item.attr('y', prevHeight);
        prevHeight += getShapeSpace(item).height + col;
      });
    }
    if (!autoWrap) {
      // 不自动换列，【若超出高度】纵向出现翻页按钮
    }
    let prevWidth = left;
    let prevHeight = top;
    this.getItems().forEach((item) => {
      if (prevHeight >= maxHeight) {
        prevWidth += itemWidth + row;
        prevHeight = top;
      }
      item.attr({ x: prevWidth, y: prevHeight });
      prevHeight += getShapeSpace(item).height + col;
    });
    // 超出列数翻页
  }
}
