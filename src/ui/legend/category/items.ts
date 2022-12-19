import { Group, type DisplayObject, type DisplayObjectConfig, type GroupStyleProps } from '@antv/g';
import { noop, set } from '@antv/util';
import { GUI } from '../../../core/gui';
import type { CallbackableObject, CallbackParameter, PrefixedStyle } from '../../../types';
import {
  classNames,
  deepAssign,
  filterTransform,
  getCallbackValue,
  groupBy,
  Padding,
  select,
  Selection,
  subObject,
} from '../../../util';
import { Navigator, type NavigatorStyleProps } from '../../navigator';
import { ifHorizontal } from '../utils';
import { CategoryItem, type CategoryItemData, type CategoryItemStyleProps } from './item';

interface CategoryItemsDatum extends CategoryItemData {
  [keys: string]: any;
}

interface CategoryItemsCfg {
  orient?: 'horizontal' | 'vertical';
  data: CategoryItemsDatum[];
  layout?: 'flex' | 'grid';
  width?: number;
  height?: number;
  gridRow?: number;
  gridCol?: number;
  // maxItemWidth?: number;
  padding?: Padding;
  rowPadding?: number;
  colPadding?: number;
  click?: (el: Selection) => void;
  mouseenter?: (el: Selection) => void;
  mouseleave?: (el: Selection) => void;
}

type CallbackableItemStyle = CallbackableObject<
  Omit<CategoryItemStyleProps, 'width' | 'height'>,
  CallbackParameter<CategoryItemsDatum>
>;

export type CategoryItemsStyleProps = GroupStyleProps &
  CategoryItemsCfg &
  PrefixedStyle<NavigatorStyleProps, 'nav'> &
  PrefixedStyle<CallbackableItemStyle, 'item'>;

type ItemLayout = {
  page: number;
  index: number;
  pageIndex: number;
  row: number;
  col: number;
  x: number;
  y: number;
  [keys: string]: any;
};

const CLASS_NAMES = classNames(
  {
    page: 'item-page',
    navigator: 'navigator',
    item: 'item',
  },
  'items'
);

const CATEGORY_ITEMS_DEFAULT_CFG: CategoryItemsStyleProps = {
  data: [],
  gridRow: Infinity,
  gridCol: undefined,
  padding: 0,
  width: 1000,
  height: 100,
  rowPadding: 0,
  colPadding: 0,
  layout: 'flex',
  orient: 'horizontal',
  click: noop,
  mouseenter: noop,
  mouseleave: noop,
};

/**
 * if value exists, it need to follow rule, otherwise, return default value
 * @param value
 * @param rule
 * @param defaultValue
 * @returns
 */
const ifSatisfied = <T>(value: T, rule: (val: T) => boolean, defaultValue = true) => {
  if (value) {
    return rule(value);
  }
  return defaultValue;
};

export class CategoryItems extends GUI<CategoryItemsStyleProps> {
  constructor(config: DisplayObjectConfig<CategoryItemsStyleProps>) {
    super(deepAssign({}, { style: CATEGORY_ITEMS_DEFAULT_CFG }, config));
  }

  private items: CategoryItem[] = [];

  private itemsCache = this.appendChild(new Group());

  private pageViews: Group[] = [];

  private navigator!: Selection;

  private navigatorShape: [number, number] = [0, 0];

  private get attrs() {
    return filterTransform(this.attributes) as CategoryItemsStyleProps;
  }

  private get grid(): [number, number] {
    const { gridRow, gridCol, data } = this.attrs;
    if (!gridRow && !gridCol) throw new Error('gridRow and gridCol can not be set null at the same time');
    if (!!gridRow && !!gridCol) return [gridRow, gridCol];
    if (gridRow) return [gridRow, data.length];
    return [data.length, gridCol!]; // !!gridCol
  }

  private get renderData() {
    const { data, layout } = this.attrs;
    const style = subObject(this.attrs, 'item');
    const d = data.map((datum, index) => {
      const { id = index as number, label, value } = datum;
      return {
        id: `${id}`,
        index,
        style: {
          layout,
          label,
          value,
          ...Object.fromEntries(
            Object.entries(style).map(([key, val]) => [key, getCallbackValue(val, [datum, index, data])])
          ),
        },
      };
    });
    return d;
  }

  private getGridLayout() {
    const { orient, width, rowPadding, colPadding } = this.attrs as Required<CategoryItemsStyleProps>;
    const [navWidth] = this.navigatorShape;
    const [gridRow, gridCol] = this.grid;
    const pageSize = gridCol * gridRow;

    let prevOffset = 0;
    return (this.itemsCache.children as CategoryItem[]).map((item, index) => {
      // calc page, row and column
      const page = Math.floor(index / pageSize);
      const pageIndex = index % pageSize;
      const dir = this.ifHorizontal(gridCol, gridRow);
      const pos = [Math.floor(pageIndex / dir), pageIndex % dir];
      if (orient === 'vertical') pos.reverse();
      const [row, col] = pos;

      // calc x, y and shape
      const colWidth = (width - navWidth - (gridCol - 1) * colPadding) / gridCol;
      const rowHeight = item.getBBox().height;

      let [x, y] = [0, 0];
      if (orient === 'horizontal') {
        [x, y] = [prevOffset, row * (rowHeight + rowPadding)];
        prevOffset = col === gridCol - 1 ? 0 : prevOffset + colWidth + colPadding;
      } else {
        [x, y] = [col * (colWidth + colPadding), prevOffset];
        prevOffset = row === gridRow - 1 ? 0 : prevOffset + rowHeight + rowPadding;
      }

      return { page, index, row, col, pageIndex, width: colWidth, height: rowHeight, x, y } as ItemLayout;
    });
  }

  private getFlexLayout(): ItemLayout[] {
    const {
      width: maxWidth,
      height: maxHeight,
      rowPadding,
      colPadding: cP,
    } = this.attrs as Required<CategoryItemsStyleProps>;
    const [navWidth] = this.navigatorShape;
    const [gridRow, gridCol] = this.grid;
    const [limitWidth, limitHeight] = [maxWidth - navWidth, maxHeight];
    let [x, y, page, pageIndex, col, row, prevWidth, prevHeight] = [0, 0, 0, 0, 0, 0, 0, 0];

    return (this.itemsCache.children as CategoryItem[]).map((item, index) => {
      const { width, height } = (item as DisplayObject).getBBox();
      const colPadding = prevWidth === 0 ? 0 : cP;
      // assume that every item has the same height
      const nextWidth = prevWidth + colPadding + width;
      // inline
      if (nextWidth <= limitWidth && ifSatisfied(col, (c) => c < gridCol)) {
        [x, y, prevWidth] = [prevWidth + colPadding, prevHeight, nextWidth];
        return { width, height, x, y, page, index, pageIndex: pageIndex++, row, col: col++ };
      }

      // wrap
      [row, col, prevWidth, prevHeight] = [row + 1, 0, 0, prevHeight + height + rowPadding];
      const nextHeight = prevHeight + rowPadding + height;
      if (nextHeight <= limitHeight && ifSatisfied(row, (r) => r < gridRow)) {
        [x, y, prevWidth] = [prevWidth, prevHeight, width];
        return { width, height, x, y, page, index, pageIndex: pageIndex++, row, col: col++ };
      }

      // paging
      [x, y, prevWidth, prevHeight, page, pageIndex, row, col] = [0, 0, width, 0, page + 1, 0, 0, 0];
      return { width, height, x, y, page, index, pageIndex: pageIndex++, row, col: col++ };
    });
  }

  private get itemsLayout() {
    this.navigatorShape = [0, 0];
    const cb = this.attributes.layout === 'grid' ? this.getGridLayout : this.getFlexLayout;
    const layout = cb.call(this);
    // re layout
    if (layout.slice(-1)[0].page > 0) {
      this.navigatorShape = [55, 0];
      return cb.call(this);
    }
    return layout;
  }

  private ifHorizontal<T>(a: T, b: T): T {
    const { orient } = this.attrs;
    return ifHorizontal(orient, a, b);
  }

  private renderItems() {
    const { click, mouseenter, mouseleave } = this.attrs;

    select(this.itemsCache)
      .selectAll(CLASS_NAMES.page.class)
      .data(this.renderData)
      .join(
        (enter) =>
          enter
            .append(({ style }) => new CategoryItem({ style }))
            .attr('className', CLASS_NAMES.item.name)
            .on('click', function () {
              click?.(this);
            })
            .on('mouseenter', function () {
              mouseenter?.(this);
            })
            .on('mouseleave', function () {
              mouseleave?.(this);
            }),
        (update) => update,
        (exit) => exit.remove()
      );
  }

  private clearCache() {
    this.itemsCache.removeChildren();
    this.pageViews.forEach((page) => page.destroy());
    this.pageViews.splice(0);
  }

  private adjustLayout() {
    const itemsCache = [...this.itemsCache.children];
    const layouts = Object.entries(groupBy(this.itemsLayout, 'page')).map(([page, items]) => ({ page, items }));

    this.clearCache();

    layouts.forEach(({ items }) => {
      const page = new Group({
        className: CLASS_NAMES.page.name,
      });
      this.pageViews.push(page);
      items.forEach((layout) => {
        const { x, y, index, width, height } = layout;
        const item = page.appendChild(itemsCache[index]) as CategoryItem;
        set(item, '__data__', layout);
        item.update({ x, y, width, height });
      });
    });
    this.itemsCache.destroyChildren();
  }

  private renderNavigator(container: Selection) {
    const { orient, layout, width } = this.attrs;
    const [navWidth, navHeight] = this.navigatorShape;
    const navStyle = subObject(this.attrs, 'nav');
    const height = (this.pageViews[0] as Group)?.getBBox().height || 0;
    const shape = layout === 'grid' ? { pageWidth: width! - navWidth, pageHeight: height - navHeight } : {};
    const style = {
      ...navStyle,
      ...shape,
      orient,
      pageViews: this.pageViews,
    };

    this.navigator = container
      .maybeAppendByClassName(CLASS_NAMES.navigator, () => new Navigator({ style: { pageViews: [] } }))
      .update(style);
  }

  render(attributes: Required<CategoryItemsStyleProps>, container: Group) {
    const { data } = this.attributes;
    if (!data || data.length === 0) return;
    /**
     * 1. render items
     * 2. paging
     * 3. layout
     */
    this.renderItems();
    this.adjustLayout();
    this.renderNavigator(select(container));
  }
}
