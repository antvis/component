import { CustomEvent } from '@antv/g';
import { min, isFunction, deepMix } from '@antv/util';
import { deepAssign, maybeAppend } from '../../util';
import { CategoryItem, CategoryItemStyleProps } from './categoryItem';
import type { CategoryCfg, CategoryOptions } from './types';
import { CATEGORY_DEFAULT_OPTIONS, DEFAULT_ITEM_MARKER, DEFAULT_ITEM_NAME, DEFAULT_ITEM_VALUE } from './constant';
import { LegendBase } from './base';
import { CategoryItems } from './categoryItems';

export type { CategoryOptions };

export class Category extends LegendBase<CategoryCfg> {
  public static defaultOptions = {
    type: Category.tag,
    ...CATEGORY_DEFAULT_OPTIONS,
  };

  constructor(options: CategoryOptions) {
    super(deepAssign({}, Category.defaultOptions, options));
  }

  public update(cfg: Partial<CategoryCfg> = {}) {
    super.update(deepAssign({}, Category.defaultOptions.style, this.attributes, cfg));
  }

  protected labelsGroup!: CategoryItems;

  protected drawInner() {
    this.drawItems();
  }

  protected bindEvents() {}

  private drawItems() {
    const innerGroup = maybeAppend(this, '.legend-inner-group', 'g').attr('className', 'legend-inner-group').node();
    this.labelsGroup = maybeAppend(innerGroup, '.category-items', () => new CategoryItems({}))
      .attr('className', 'category-items')
      .call((selection) => {
        (selection.node() as CategoryItems).update({
          orient: this.orient,
          items: this.itemsStyleProps,
          spacing: this.style.spacing,
          autoWrap: this.style.autoWrap,
          maxRows: this.style.maxRows,
          maxWidth: this.style.maxWidth,
          maxHeight: this.style.maxHeight,
          cols: this.style.cols,
          ...(this.style.pageNavigator || {}),
        });
      })
      .node() as CategoryItems;
  }

  private get idItem(): Map<string, CategoryItem> {
    const legendItems = this.labelsGroup?.querySelectorAll('.legend-item') as CategoryItem[];
    return new Map((legendItems || []).map((item) => [item.style.id, item]));
  }

  public getItem(id: string): CategoryItem | undefined {
    return this.idItem.get(id);
  }

  /**
   * 设置某个item的状态
   * 会改变其样式
   */
  public setItemState(id: string, state: string) {
    this.getItem(id)?.setState(state);
  }

  /**
   * 获得items状态列表
   */
  public getItemsStates(): { id: string; state: string }[] {
    return Array.from(this.idItem.entries()).map(([id, item]) => ({ id, state: item.getState() }));
  }

  // ======== 之前的代码
  private get itemsStyleProps(): CategoryItemStyleProps[] {
    const { items: _items, maxWidth, maxItemWidth, itemMarker, itemName, itemValue, reverse } = this.style;
    const items = _items.slice();
    if (reverse) items.reverse();

    return items.map((item, idx) => {
      return {
        id: item.id || `legend-item-${idx}`,
        state: item.state || 'default',
        value: item,
        maxItemWidth: min([maxItemWidth ?? Number.MAX_VALUE, maxWidth ?? Number.MAX_VALUE]),
        itemMarker: (() => {
          const markerCfg = isFunction(itemMarker) ? itemMarker(item, idx, items) : itemMarker;
          return deepMix(
            {},
            DEFAULT_ITEM_MARKER,
            { symbol: item.marker, style: { fill: item.color, stroke: item.color } },
            markerCfg
          );
        })(),
        itemName: (() => {
          const { formatter, ...itemNameCfg } = deepMix({}, { formatter: () => item.name }, itemName);
          return deepMix({}, DEFAULT_ITEM_NAME, { content: formatter(item, idx, items) }, itemNameCfg);
        })(),
        itemValue: (() => {
          const { formatter, ...itemValueCfg } = deepMix({}, { formatter: () => item.value }, itemValue);
          return deepMix({}, DEFAULT_ITEM_VALUE, { content: formatter(item, idx, items) }, itemValueCfg);
        })(),
        itemWidth: this.style.itemWidth,
        itemHeight: this.style.itemHeight,
        padding: this.style.itemPadding,
        backgroundStyle: this.style.itemBackgroundStyle as any,
      };
    });
  }

  private dispatchItemsChange() {
    const evt = new CustomEvent('valueChanged', {
      detail: { value: this.getItemsStates() },
    });
    this.dispatchEvent(evt as any);
  }
}
