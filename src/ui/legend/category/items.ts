import type { DisplayObject, DisplayObjectConfig, GroupStyleProps } from '@antv/g';
import { Group } from '@antv/g';
import { noop, set } from '@antv/util';
import { GUI } from '../../../core/gui';
import type { CallbackableObject, CallbackParameter, PrefixedStyle } from '../../../types';
import {
  classNames,
  deepAssign,
  filterTransform,
  getCallbackValue,
  getStyleFromPrefixed,
  groupBy,
  Padding,
  select,
  Selection,
} from '../../../util';
import type { NavigatorStyleProps } from '../../navigator';
import { Navigator } from '../../navigator';
import { ifHorizontal } from '../utils';
import type { CategoryItemData, CategoryItemStyle } from './item';
import { CategoryItem } from './item';

interface CategoryItemsDatum extends CategoryItemData {
  [keys: string]: any;
}

interface CategoryItemsCfg {
  orient?: 'horizontal' | 'vertical';
  data: CategoryItemsDatum[];
  width?: number;
  height?: number;
  gridRow?: number;
  gridCol?: number;
  maxWidth?: number;
  maxHeight?: number;
  padding?: Padding;
  rowPadding?: number;
  colPadding?: number;
  click?: (el: Selection) => void;
  mouseenter?: (el: Selection) => void;
  mouseleave?: (el: Selection) => void;
}

type CallbackableItemStyle = CallbackableObject<
  Omit<CategoryItemStyle, 'width' | 'height'>,
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
    itemPage: 'item-page',
    navigator: 'navigator',
    pageView: 'page-view',
    item: 'item',
  },
  'items'
);

const CATEGORY_ITEMS_DEFAULT_CFG: CategoryItemsStyleProps = {
  data: [],
  gridRow: 1,
  padding: 0,
  maxWidth: 500,
  maxHeight: 20,
  rowPadding: 0,
  colPadding: 0,
  orient: 'horizontal',
  click: noop,
  mouseenter: noop,
  mouseleave: noop,
};

export class CategoryItems extends GUI<CategoryItemsStyleProps> {
  constructor(config: DisplayObjectConfig<CategoryItemsStyleProps>) {
    super(deepAssign({}, { style: CATEGORY_ITEMS_DEFAULT_CFG }, config));
  }

  private items: CategoryItem[] = [];

  private itemsCache = new Group();

  private pageViews = new Group({ className: CLASS_NAMES.pageView.name });

  private get attrs() {
    return filterTransform(this.attributes) as CategoryItemsStyleProps;
  }

  private get itemShape(): 'fixed' | 'fit' {
    const { width, height } = this.attrs;
    if (width && height) return 'fixed';
    return 'fit';
  }

  private get grid(): [number, number] {
    const { gridRow, gridCol, data } = this.attrs;
    if (!gridRow && !gridCol) throw new Error('gridRow and gridCol can not be set null at the same time');
    if (!!gridRow && !!gridCol) return [gridRow, gridCol];
    if (gridRow) return [1, data.length];
    return [data.length, 1]; // !!gridCol
  }

  private get renderData() {
    const { data } = this.attrs;
    const style = getStyleFromPrefixed(this.attrs, 'item');
    const d = data.map((datum, index) => {
      const { id = index, label, value } = datum;
      return {
        id: `${id}`,
        index,
        style: {
          layout: this.itemShape,
          label,
          value,
          ...Object.fromEntries(
            Object.entries(style).map(([key, val]) => [
              key,
              key === 'marker' ? val : getCallbackValue(val, [datum, index, data]),
            ])
          ),
        },
      };
    });
    return d;
  }

  private get gridLayout() {
    const { orient, width, height, rowPadding, colPadding } = this.attrs as Required<CategoryItemsStyleProps>;
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
      const colWidth = (width - (gridCol - 1) * colPadding) / gridCol;
      const rowHeight = (height - (gridRow - 1) * rowPadding) / gridRow;
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

  private get flexLayout(): ItemLayout[] {
    const { maxWidth, maxHeight, rowPadding, colPadding: cP } = this.attrs as Required<CategoryItemsStyleProps>;
    let [x, y, page, pageIndex, col, row, prevWidth, prevHeight] = [0, 0, 0, 0, 0, 0, 0, 0];

    return (this.itemsCache.children as CategoryItem[]).map((item, index) => {
      const { width, height } = item.getBBox();
      const colPadding = prevWidth === 0 ? 0 : cP;
      // assume that every item has the same height
      const nextWidth = prevWidth + colPadding + width;
      // inline
      if (nextWidth <= maxWidth) {
        [x, y, prevWidth] = [prevWidth + colPadding, prevHeight, nextWidth];
        return { width, height, x, y, page, index, pageIndex: pageIndex++, row, col: col++ };
      }

      // wrap
      [row, col, prevWidth, prevHeight] = [row + 1, 0, 0, prevHeight + height + rowPadding];
      const nextHeight = prevHeight + rowPadding + height;
      if (nextHeight <= maxHeight) {
        [x, y, prevWidth] = [prevWidth, prevHeight, width];
        return { width, height, x, y, page, index, pageIndex: pageIndex++, row, col: col++ };
      }

      // paging
      [x, y, prevWidth, prevHeight, page, pageIndex, col] = [0, 0, width, 0, page + 1, 0, 0];
      return { width, height, x, y, page, index, pageIndex: pageIndex++, row: 0, col: col++ };
    });
  }

  private get itemsLayout() {
    /**
     * precondition:
     * gridRow, maxWidth, maxHeight is preset
     *
     * layout 1: if itemShape is fixed (width and height have been specified)
     * use grid layout, wrap depends on gridCol, paging depends on count of items exceed gridRow * gridCol
     *
     * layout 2: otherwise
     * use flex layout, wrapping when width close to maxWidth, paging when height close to maxHeight
     * note: at least one line is in the layout
     */
    return this.itemShape === 'fixed' ? this.gridLayout : this.flexLayout;
  }

  private ifHorizontal<T>(a: T, b: T): T {
    const { orient } = this.attrs;
    return ifHorizontal(orient, a, b);
  }

  private renderItems() {
    const { click, mouseenter, mouseleave } = this.attrs;
    this.items = [];
    this.itemsCache.removeChildren();
    const itemEls = this.items;
    select(this.itemsCache)
      .selectAll(CLASS_NAMES.itemPage.class)
      .data(this.renderData)
      .join(
        (enter) =>
          enter
            .append(({ style }) => {
              const item = new CategoryItem({ style });
              itemEls.push(item);
              return item;
            })
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
        (update) =>
          update.each(function ({ style }) {
            this.update(style);
          }),
        (exit) => exit.remove()
      );

    // mount to this to calculate bbox
    this.appendChild(this.itemsCache).style.visibility = 'hidden';
  }

  private adjustLayout() {
    const { items, itemsLayout } = this;
    select(this.pageViews)
      .selectAll(CLASS_NAMES.itemPage.class)
      .data(Object.entries(groupBy(itemsLayout, 'page')).map(([page, items]) => ({ page, items })))
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('className', CLASS_NAMES.itemPage.name)
            .each(function ({ items: l }) {
              l.forEach((layout) => {
                const { x, y, index, width, height } = layout;
                const item = this.appendChild(items[index]);
                set(item, '__data__', layout);
                item.attr('x', x).attr('y', y).attr('width', width).attr('height', height);
              });
            }),
        (update) => update,
        (exit) => exit.remove()
      );
    // unmount pageViews
    this.removeChild(this.itemsCache);
  }

  private renderNavigator(container: Selection) {
    const { orient, width, height } = this.attrs;
    const navStyle = getStyleFromPrefixed(this.attrs, 'nav');
    const shape = this.itemShape === 'fixed' ? { pageWidth: width, pageHeight: height } : {};
    container.maybeAppendByClassName(
      CLASS_NAMES.navigator,
      () =>
        new Navigator({
          style: {
            ...navStyle,
            ...shape,
            orient,
            pageViews: this.pageViews.children as DisplayObject[],
          },
        })
    );
  }

  render(attributes: Required<CategoryItemsStyleProps>, container: Group) {
    const ctn = select(container);
    /**
     * 1. render items
     * 2. paging
     * 3. layout
     */
    this.renderItems();
    this.adjustLayout();
    this.renderNavigator(ctn);
  }
}
