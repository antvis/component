import { CustomEvent } from '@antv/g';
import { min, isFunction, deepMix } from '@antv/util';
import { deepAssign, defined, getShapeSpace, normalPadding, select } from '../../util';
import type { StyleState as State } from '../../types';
import { CategoryItem } from './category-item';
import type { CategoryCfg, CategoryOptions } from './types';
import { CATEGORY_DEFAULT_OPTIONS, DEFAULT_ITEM_MARKER, DEFAULT_ITEM_NAME, DEFAULT_ITEM_VALUE } from './constant';
import { PageNavigator } from './pageNavigator';
import { LegendBase } from './legendBase';

export type { CategoryOptions };

export class Category extends LegendBase<CategoryCfg> {
  public static defaultOptions = {
    type: Category.tag,
    ...CATEGORY_DEFAULT_OPTIONS,
  };

  protected get itemsGroup() {
    return select(this.container).select('.legend-items-group').node();
  }

  protected get idItem(): Map<string, CategoryItem> {
    return new Map((this.itemsGroup.childNodes as CategoryItem[]).map((item) => [item.getID(), item]));
  }

  constructor(options: CategoryOptions) {
    super(deepAssign({}, Category.defaultOptions, options));
  }

  public init() {
    select(this.container).append('g').attr('className', 'legend-items-group');
    super.init();
  }

  public update(cfg: Partial<CategoryCfg> = {}) {
    this.attr(deepAssign({}, Category.defaultOptions.style, this.attributes, cfg));
    const [top, , , left] = this.padding;
    this.container.setLocalPosition(left, top);

    this.drawTitle();
    this.drawInner();
    this.drawBackground();
  }

  protected drawInner() {
    this.drawItems();
    this.drawPageNavigator();
    this.adjustLayout();
  }

  protected bindEvents() {
    this.itemsGroup.addEventListener('stateChange', () => this.dispatchItemsChange());
  }

  protected drawItems() {
    const data = this.itemsShapeCfg;
    select(this.itemsGroup)
      .selectAll('.legend-item')
      .data(data, (d) => d.id)
      .join(
        (enter) => enter.append((datum) => new CategoryItem({ className: 'legend-item', style: datum })),
        (update) => update.each((shape, datum) => shape.update(datum)),
        (exit) => exit.remove()
      );
  }

  protected pager!: PageNavigator;

  protected drawPageNavigator() {
    const style = this.getPageNavigatorStyleProps();
    let pageNavigator = this.container.querySelector('.legend-navigation') as PageNavigator;
    if (!pageNavigator) {
      pageNavigator = this.container.appendChild(new PageNavigator({ className: 'legend-navigation', style }));
    } else {
      pageNavigator.update(style);
    }

    this.pager = pageNavigator;
  }

  protected getPageNavigatorStyleProps() {
    const { orient, pageNavigator } = this.style;
    const { pageWidth, pageHeight, pageNum = 1 } = this;

    let position = pageNavigator && pageNavigator?.position;
    if (!position) position = orient === 'horizontal' ? 'right' : 'bottom';

    return deepMix(
      {},
      {
        x: 0,
        y: 0,
        orient: orient as any,
        view: this.itemsGroup,
        position,
        pageNum,
        pageWidth: pageWidth ?? Number.MAX_VALUE,
        pageHeight: pageHeight ?? Number.MAX_VALUE,
        visibility: !pageWidth || !pageHeight,
      },
      pageNavigator
    );
  }

  // ======== 之前的代码
  private get itemsShapeCfg() {
    const {
      items: _items,
      itemWidth,
      maxWidth,
      maxItemWidth,
      itemMarker,
      itemName,
      itemValue,
      itemBackground,
      reverse,
    } = this.style;
    const items = _items.slice();
    if (reverse) items.reverse();

    return items.map((item, idx) => {
      return {
        x: 0,
        y: 0,
        id: item.id || `legend-item-${idx}`,
        state: item.state || 'default',
        itemWidth,
        maxItemWidth: min([maxItemWidth ?? Number.MAX_VALUE, maxWidth ?? Number.MAX_VALUE]),
        itemMarker: (() => {
          const markerCfg = isFunction(itemMarker) ? itemMarker(item, idx, items) : itemMarker;
          return deepMix(
            {},
            DEFAULT_ITEM_MARKER,
            { symbol: item.symbol, style: { default: { fill: item.color, stroke: item.color } } },
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
        background: itemBackground as any,
      };
    });
  }

  public getItem(id: string): CategoryItem | undefined {
    return this.idItem.get(id);
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
    return Array.from(this.idItem.entries()).map(([id, item]) => ({ id, state: item.getState() }));
  }

  /** 分页相关配置 */
  private pageWidth: number | undefined;

  private pageHeight: number | undefined;

  private pageNum: number = 1;

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
    const { orient } = this.style;
    this.resetPageCfg();
    if (orient === 'horizontal') this.adjustHorizontal();
    else this.adjustVertical();

    const { padding } = this.style;
    const p = (Array.isArray(padding) ? padding : [padding]) as number[];
    const top = this.titleShapeBBox.bottom;
    const left = p[1] ?? p[0] ?? 0;
    this.itemsGroup.setLocalPosition(left, top);

    if (this.pager) {
      const { pageWidth: w, pageHeight: h, pageNum = 1 } = this;
      this.pager.update({
        orient,
        x: left,
        y: top,
        pageNum,
        pageHeight: pageNum > 1 ? h ?? Number.MAX_VALUE : Number.MAX_VALUE,
        pageWidth: pageNum > 1 ? w ?? Number.MAX_VALUE : Number.MAX_VALUE,
        visibility: pageNum > 1 && h && w ? 'visible' : 'hidden',
      });
    }
  }

  private get itemHeight(): number {
    const item = Array.from(this.idItem.values())[0];
    return item ? getShapeSpace(item).height : 0;
  }

  private adjustHorizontal() {
    if (this.idItem.size <= 1) return;

    const items = Array.from(this.idItem.values());
    const { spacing: [offsetX] = [0, 0], autoWrap } = this.style;
    const padding = normalPadding(this.style.padding);
    const maxWidth = this.style.maxWidth && this.style.maxWidth - (padding[1] + padding[3]);

    // Do not need paginate.
    if (!defined(maxWidth) || maxWidth === Infinity) {
      items.reduce((x, item) => {
        const { width } = getShapeSpace(item);
        item.setLocalPosition(x, 0);
        return x + width + offsetX;
      }, 0);
      return;
    }

    this.pageNum = 1;
    this.pageWidth = maxWidth;
    const position = this.getPageNavigatorStyleProps()?.position || 'right';
    if (['left', 'right', 'left-right'].includes(position as any)) {
      const pagerWidth = this.pager?.getBBox().width;
      this.pageWidth! -= pagerWidth;
    }

    if (!autoWrap) {
      this.pageHeight = this.itemHeight;
      items.reduce((x, item) => {
        const { width } = getShapeSpace(item);
        if (x + width > this.pageWidth! * this.pageNum) {
          x = this.pageWidth! * this.pageNum;
          this.pageNum += 1;
        }
        item.pageIndex = this.pageNum;
        item.setLocalPosition(x, 0);
        return x + width + offsetX;
      }, 0);

      return;
    }

    const maxRows = this.style.maxRows || Number.MAX_VALUE;
    let row = 1;
    let x = 0;
    let y = 0;
    this.pageHeight = this.itemHeight!;
    items.forEach((item) => {
      const { width, height } = getShapeSpace(item);
      if (x + width > this.pageWidth! * this.pageNum) {
        if (row === maxRows) {
          x = this.pageWidth! * this.pageNum;
          this.pageNum += 1;
          row = 1;
        } else {
          row += 1;
          x = this.pageWidth! * (this.pageNum - 1);
        }
        y = (row - 1) * this.itemHeight!;
        this.pageHeight = Math.max(this.pageHeight!, y + height);
      }
      item.pageIndex = this.pageNum;
      item.setLocalPosition(x, y);
      x += width + offsetX;
    });
  }

  private adjustVertical() {
    if (this.idItem.size <= 1) return;

    const items = Array.from(this.idItem.values());

    const { spacing: [, offsetY] = [0, 0], autoWrap } = this.style;
    const padding = normalPadding(this.style.padding);
    const maxHeight = this.style.maxHeight && this.style.maxHeight - (padding[0] + padding[2]);

    // Do not need paginate.
    if (!defined(maxHeight) || maxHeight === Infinity) {
      items.reduce((y, item) => {
        const { height } = getShapeSpace(item);
        item.setLocalPosition(0, y);
        return y + height + offsetY;
      }, 0);
      return;
    }

    this.pageNum = 1;
    this.pageHeight = maxHeight;
    const position = this.getPageNavigatorStyleProps()?.position || 'right';
    if (['top', 'bottom', 'top-bottom'].includes(position as any)) {
      const pagerH = this.pager?.getBBox().height;
      this.pageHeight! -= pagerH;
    }

    this.pageHeight = Math.max(this.pageHeight!, this.itemHeight!);
    // [todo] autoWrap in vertical direction.
    let itemWidth = 0;
    items.reduce((y, item) => {
      const { width, height } = getShapeSpace(item);
      if (y + height > this.pageHeight! * this.pageNum) {
        y = this.pageHeight! * this.pageNum;
        this.pageNum += 1;
      }
      item.setLocalPosition(0, y);
      itemWidth = Math.max(itemWidth, width);
      return y + height + offsetY;
    }, 0);
    this.pageWidth = Math.min(
      this.style.maxWidth ?? Number.MAX_VALUE,
      this.style.maxItemWidth ?? Number.MAX_VALUE,
      itemWidth
    );
  }

  private dispatchItemsChange() {
    const evt = new CustomEvent('valueChanged', {
      detail: { value: this.getItemsStates() },
    });
    this.dispatchEvent(evt as any);
  }
}
