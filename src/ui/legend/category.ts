import type { DisplayObject } from '@antv/g';
import { CustomEvent, Group } from '@antv/g';
import { clone, deepMix, get, isFunction, isNumber, min, pick } from '@antv/util';
import { LegendBase } from './base';
import { CategoryItem } from './category-item';
import { getShapeSpace } from '../../util';
import { PageNavigator } from '../page-navigator';
import { CATEGORY_DEFAULT_OPTIONS } from './constant';
import type { StyleState as State } from '../../types';
import type { CategoryCfg, CategoryOptions } from './types';
import type { ICategoryItemCfg } from './category-item';

export type { CategoryOptions };

// 找到node节点所在的CategoryItem节点
function getParentItem(node: DisplayObject) {
  let item = node;
  try {
    while (item.config.type !== 'categoryItem') {
      item = item.parentNode as DisplayObject;
    }
    if (item.config.type === 'categoryItem') return item as CategoryItem;
  } catch (e) {
    return null;
  }
  return null;
}

export class Category extends LegendBase<CategoryCfg> {
  public static tag = 'category';

  protected static defaultOptions = {
    type: Category.tag,
    ...CATEGORY_DEFAULT_OPTIONS,
  };

  protected get backgroundShapeCfg() {
    const { width, height } = getShapeSpace(this);
    return {
      width,
      height,
      ...this.getStyle('backgroundStyle'),
    };
  }

  private get items() {
    return this.itemsGroup.children as CategoryItem[];
  }

  private get itemsShapeCfg() {
    const {
      items: _items,
      itemWidth,
      maxWidth,
      maxItemWidth,
      itemMarker,
      itemName,
      itemValue,
      itemBackgroundStyle,
      reverse,
    } = this.attributes;
    const {
      itemMarker: defaultMarker,
      itemName: defaultName,
      itemValue: defaultValue,
      backgroundStyle: defaultBackgroundStyle,
    } = get(CATEGORY_DEFAULT_OPTIONS, ['style']);
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
        maxItemWidth: min([maxItemWidth, maxWidth])!,
        // 这里使用name-idx作为id
        identify: id !== undefined ? id : `${nameContent}-${idx}`,
        itemMarker: isFunction(itemMarker) ? deepMix({}, defaultMarker, itemMarker(item, idx, items)) : itemMarker,
        itemName: (() => {
          const { formatter, style, spacing } = isFunction(itemName)
            ? deepMix({}, defaultName, itemName(item, idx, items))
            : itemName;
          return {
            style,
            spacing,
            content: formatter!(nameContent),
          };
        })(),
        itemValue: (() => {
          const { formatter, style, spacing } = isFunction(itemValue)
            ? deepMix({}, defaultValue, itemValue(item, idx, items))
            : itemValue;
          return {
            style,
            spacing,
            content: formatter!(valueContent),
          } as ICategoryItemCfg['itemValue'];
        })(),
        backgroundStyle: isFunction(itemBackgroundStyle)
          ? deepMix({}, defaultBackgroundStyle, itemBackgroundStyle(item, idx, items))
          : itemBackgroundStyle,
      });
    });
    return cfg;
  }

  private get itemHeight(): number {
    return getShapeSpace(this.items[0]).height;
  }

  /** 分页相关配置 */
  private pageWidth: number | undefined;

  private pageHeight: number | undefined;

  private pageNum: number = 1;

  private pageNavigator!: PageNavigator | null;

  private itemsGroup!: Group;

  constructor(options: CategoryOptions) {
    super(deepMix({}, Category.defaultOptions, options));
    super.init();
    this.init();
  }

  public init() {
    this.initShape();
    this.createItems();
    this.adjustLayout();
    this.createBackground();
    this.bindEvents();
  }

  public update(cfg: Partial<CategoryCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    super.update();
    // TODO 对于items的变化目前进行重绘操作，后期可参考React Diff方法进行性能优化
    this.createItems();
    this.adjustLayout();
    this.backgroundShape.attr(this.backgroundShapeCfg);
  }

  public clear() {}

  /**
   * 根据id获取item
   */
  public getItem(id: string): CategoryItem | undefined {
    const { items } = this;
    return items.filter((item: CategoryItem) => {
      return item.getID() === id;
    })[0];
  }

  /**
   * 设置某个item的状态
   * 会改变其样式
   */
  public setItemState(id: string, state: State) {
    this.getItem(id)?.setState(state);
  }

  /**
   * 获得items状态列表
   */
  public getItemsStates(): { id: string; state: State }[] {
    const { items } = this;
    return items.map((item) => {
      return { id: item.getID(), state: item.getState() };
    });
  }

  protected initShape() {
    super.initShape();
    this.itemsGroup = new Group({
      name: 'itemsGroup',
    });
  }

  /**
   * 创建图例项
   */
  private createItems() {
    this.clearItems();
    this.itemsShapeCfg.forEach((cfg) => {
      this.itemsGroup.appendChild(new CategoryItem({ style: cfg, name: 'item' }));
    });
  }

  private clearItems() {
    this.itemsGroup.setLocalPosition(0, 0);
    this.itemsGroup.removeChildren(true);
  }

  /**
   * 创建分页的items
   */
  private createPageItems() {
    const { orient, pageNavigator } = this.attributes;
    const { pageWidth, pageHeight, pageNum } = this;
    const { x: left, y: top } = this.availableSpace;
    const flag = pageNum > 1 && isNumber(pageWidth) && isNumber(pageHeight);

    const cfg = {
      orient,
      pageWidth: pageWidth!,
      pageHeight: pageHeight!,
      view: this.itemsGroup,
      ...pageNavigator,
    };
    // 1. 存在分页器实例且flag为true，则更新分页器
    if (this.pageNavigator && flag) {
      this.pageNavigator.update(cfg);
    }
    // 2. 不存在分页器实例且flag为true，则创建分页器
    else if (!this.pageNavigator && flag) {
      this.pageNavigator = new PageNavigator({
        name: 'page-navigator',
        style: cfg,
      });
      this.appendChild(this.pageNavigator);
      this.itemsGroup.setLocalPosition(0, 0);
      this.pageNavigator.setLocalPosition(left, top);
    } else {
      // this.pageNavigator && !flag
      // remove and destroy
      // append itemsGroup to this children list
      // 3. 存在分页器实例且flag为false，则删除分页器
      if (this.pageNavigator) {
        this.pageNavigator.clear();
        this.removeChild(this.pageNavigator, true);
        this.pageNavigator.destroy();
        this.pageNavigator = null;
      }
      this.appendChild(this.itemsGroup);
      this.itemsGroup.setLocalPosition(left, top);
    }
    // 4. 不存在分页器实例且flag为false，则不做任何操作
  }

  private bindEvents() {
    // 图例项hover事件
    // 图例项点击事件
    // 翻页按钮点击事件
    this.itemsGroup.addEventListener('click', this.ItemsGroupClickEvent);
    this.itemsGroup.addEventListener('mousemove', this.mousemoveEvent);
    this.itemsGroup.addEventListener('mouseleave', this.mouseleaveEvent);
  }

  private ItemsGroupClickEvent = (e: any) => {
    const { target } = e;
    if (target) {
      const item = getParentItem(target as DisplayObject);
      if (!item) return;
      const state = item.getState();
      if (!['selected', 'selected-active'].includes(state)) item.setState('selected-active');
      else item.setState('default-active');
      this.dispatchItemsChange();
    }
  };

  private mousemoveEvent = (e: any) => {
    const { target } = e;
    if (target) {
      const item = getParentItem(target as DisplayObject);
      if (!item) {
        this.items.forEach((item) => {
          item.offHover();
        });
        return;
      }
      const state = item.getState();
      if (state !== 'active') {
        this.items.forEach((item) => {
          item.offHover();
        });
        item.onHover();
      }
    }
  };

  private mouseleaveEvent = () => {
    this.items.forEach((item) => {
      item.offHover();
    });
  };

  /**
   * 重置分页配置
   */
  private resetPageCfg() {
    this.pageWidth = undefined;
    this.pageHeight = undefined;
    this.pageNum = 1;
  }

  /**
   * 计算图例布局
   * https://www.yuque.com/antv/zb50wl/gzc4sg
   */
  private adjustLayout() {
    const { orient } = this.attributes;
    this.resetPageCfg();
    if (orient === 'horizontal') this.adjustHorizontal();
    else this.adjustVertical();
    this.createPageItems();
  }

  /**
   * 横向布局
   */
  private adjustHorizontal() {
    const {
      maxWidth,
      spacing: [rowSpacing, colSpacing],
      autoWrap,
      maxRows,
    } = this.attributes;
    const height = this.itemHeight;

    /** 不分页 */
    const noPagingFlag = !maxWidth || maxWidth === Infinity;
    /** 单行分页  */
    const oneLineWrapFlag = !autoWrap;
    if (oneLineWrapFlag) {
      this.pageWidth = maxWidth;
      this.pageHeight = height;
    }
    /** 多行分页 */
    const multiRowWrapFlag = !noPagingFlag && !oneLineWrapFlag;
    if (multiRowWrapFlag) {
      this.pageWidth = maxWidth;
      this.pageHeight = (height + colSpacing) * maxRows;
    }
    const pageWidth = this.pageWidth!;
    /** 当前图例项的将放置于currY, currY 坐标，当前行数 */
    let [currX, currY, currRows, pageNum] = [0, 0, 1, this.pageNum];
    this.items.forEach((item) => {
      const { width } = getShapeSpace(item);
      let [x, y] = [0, 0];
      if (noPagingFlag) {
        [x, y] = [currX, currY];
        currX += width + rowSpacing;
      } else {
        const nextPageStart = pageWidth * pageNum;
        if (currX + width > nextPageStart) {
          if (oneLineWrapFlag) {
            // 单行分页 and 分页
            currX = nextPageStart;
            pageNum += 1;
          } else if (currRows === maxRows) {
            // 多行分页 and 分页
            // 分页
            currRows = 1;
            currX = nextPageStart;
            currY = 0;
            pageNum += 1;
          } else {
            // 多行分页 and 分行
            // 分行
            currRows += 1;
            currX = nextPageStart - pageWidth;
            currY += height + colSpacing;
          }
        }
        [x, y] = [currX, currY];
        currX += width + rowSpacing;
      }
      item.setLocalPosition(x, y);
    });
    this.pageNum = pageNum;
  }

  /**
   * 纵向布局
   */
  private adjustVertical() {
    const {
      maxHeight,
      spacing: [rowSpacing, colSpacing],
      autoWrap,
      maxCols,
      itemWidth,
    } = this.attributes;
    const { itemHeight } = this;
    /** 不分页  */
    const noPagingFlag = !maxHeight || maxHeight === Infinity;

    /** 单列分页 */
    const oneColWrapFlag = !autoWrap;
    if (oneColWrapFlag) {
      this.pageWidth = itemWidth;
      this.pageHeight = maxHeight;
    }
    /** 多列分页 */
    const multiColWrapFlag = !noPagingFlag && !oneColWrapFlag;
    if (multiColWrapFlag) {
      this.pageWidth = (itemWidth + rowSpacing) * maxCols;
      this.pageHeight = maxHeight;
    }
    const pageHeight = this.pageHeight!;
    let [currX, currY, currCols, pageNum] = [0, 0, 1, this.pageNum];
    this.items.forEach((item) => {
      let [x, y] = [0, 0];
      if (noPagingFlag) {
        [x, y] = [currX, currY];
        currY += itemHeight + colSpacing;
      } else {
        /** 下一页开始的y坐标 */
        const nexPageStart = pageHeight * pageNum;
        if (currY + itemHeight > nexPageStart) {
          if (oneColWrapFlag) {
            currY = nexPageStart;
            pageNum += 1;
          } else if (currCols === maxCols) {
            currCols = 1;
            currX = 0;
            currY = nexPageStart;
            pageNum += 1;
          } else {
            // 分列
            currCols += 1;
            currX += itemWidth + rowSpacing;
            currY = nexPageStart - pageHeight;
          }
        }
        [x, y] = [currX, currY];
        currY += itemHeight + colSpacing;
      }
      item.setLocalPosition(x, y);
    });
    this.pageNum = pageNum;
  }

  private dispatchItemsChange() {
    const evt = new CustomEvent('valueChanged', {
      detail: {
        value: this.getItemsStates(),
      },
    });
    this.dispatchEvent(evt);
  }
}
