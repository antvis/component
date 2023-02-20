import { CustomEvent, Group, type DisplayObject, type GroupStyleProps } from '@antv/g';
import { noop, set } from '@antv/util';
import {
  GUI,
  type CallbackableStyleProps,
  type ComponentOptions,
  type PrefixStyleProps,
  type RequiredStyleProps,
} from '../../../core';
import type { CallbackParameter, MergeMultiple } from '../../../types';
import {
  classNames,
  deepAssign,
  getCallbackValue,
  groupBy,
  select,
  Selection,
  SeriesAttr,
  subStyleProps,
} from '../../../util';
import { Navigator, type NavigatorStyleProps } from '../../navigator';
import { ifHorizontal } from '../utils';
import { CategoryItem, type CategoryItemStyleProps } from './item';

interface CategoryItemsDatum {
  [keys: string]: any;
}

type CallbackableItemStyle = CallbackableStyleProps<
  Omit<CategoryItemStyleProps, 'width' | 'height'>,
  CallbackParameter<CategoryItemsDatum>
>;

export type CategoryItemsStyleProps = MergeMultiple<
  [
    PrefixStyleProps<CallbackableItemStyle, 'item'>,
    PrefixStyleProps<NavigatorStyleProps, 'nav'>,
    {
      data: CategoryItemsDatum[];
      style: GroupStyleProps & {
        orientation?: 'horizontal' | 'vertical';
        layout?: 'flex' | 'grid';
        width?: number;
        height?: number;
        gridRow?: number;
        gridCol?: number;
        // maxItemWidth?: number;
        padding?: SeriesAttr;
        rowPadding?: number;
        colPadding?: number;
        click?: (el: Selection) => void;
        mouseenter?: (el: Selection) => void;
        mouseleave?: (el: Selection) => void;
      };
    }
  ]
>;

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

export class CategoryItems extends GUI<RequiredStyleProps<CategoryItemsStyleProps>> {
  constructor(options: ComponentOptions<CategoryItemsStyleProps>) {
    super(options, {
      data: [],
      style: {
        gridRow: Infinity,
        gridCol: undefined,
        padding: 0,
        width: 1000,
        height: 100,
        rowPadding: 0,
        colPadding: 0,
        layout: 'flex',
        orientation: 'horizontal',
        click: noop,
        mouseenter: noop,
        mouseleave: noop,
      },
    });
  }

  private navigator!: Navigator;

  private navigatorShape: [number, number] = [0, 0];

  private get pageViews() {
    return this.navigator.getContainer();
  }

  private get grid(): [number, number] {
    const {
      style: { gridRow, gridCol },
      data,
    } = this.attributes;
    if (!gridRow && !gridCol) throw new Error('gridRow and gridCol can not be set null at the same time');
    if (!!gridRow && !!gridCol) return [gridRow, gridCol];
    if (gridRow) return [gridRow, data.length];
    return [data.length, gridCol!]; // !!gridCol
  }

  private get renderData() {
    const {
      data,
      style: { layout },
    } = this.attributes;
    const { style } = subStyleProps(this.attributes, 'item');

    const d = data.map((datum, index) => {
      const { id = index as number, label, value } = datum;
      return {
        id: `${id}`,
        index,
        style: {
          style: {
            layout,
            label,
            value,
            ...Object.fromEntries(
              Object.entries(style).map(([key, val]) => [key, getCallbackValue(val, [datum, index, data])])
            ),
          },
        },
      };
    });
    return d;
  }

  private getGridLayout() {
    const {
      style: { orientation, width, rowPadding, colPadding },
    } = this.attributes;
    const [navWidth] = this.navigatorShape;
    const [gridRow, gridCol] = this.grid;
    const pageSize = gridCol * gridRow;

    let prevOffset = 0;
    return (this.pageViews.children as CategoryItem[]).map((item, index) => {
      // calc page, row and column
      const page = Math.floor(index / pageSize);
      const pageIndex = index % pageSize;
      const dir = this.ifHorizontal(gridCol, gridRow);
      const pos = [Math.floor(pageIndex / dir), pageIndex % dir];
      if (orientation === 'vertical') pos.reverse();
      const [row, col] = pos;

      // calc x, y and shape
      const colWidth = (width - navWidth - (gridCol - 1) * colPadding) / gridCol;
      const rowHeight = item.getBBox().height;

      let [x, y] = [0, 0];
      if (orientation === 'horizontal') {
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
      style: { width: maxWidth, height: maxHeight, rowPadding, colPadding: cP },
    } = this.attributes;
    const [navWidth] = this.navigatorShape;
    const [gridRow, gridCol] = this.grid;

    const [limitWidth, limitHeight] = [maxWidth - navWidth, maxHeight];
    let [x, y, page, pageIndex, col, row, prevWidth, prevHeight] = [0, 0, 0, 0, 0, 0, 0, 0];

    return (this.pageViews.children as CategoryItem[]).map((item, index) => {
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
    const cb = this.attributes.style!.layout === 'grid' ? this.getGridLayout : this.getFlexLayout;
    const layout = cb.call(this);
    // re layout
    if (layout.slice(-1)[0].page > 0) {
      this.navigatorShape = [55, 0];
      return cb.call(this);
    }
    return layout;
  }

  private ifHorizontal<T>(a: T, b: T): T {
    const {
      style: { orientation },
    } = this.attributes;
    return ifHorizontal(orientation, a, b);
  }

  private flattenPage(container: Group) {
    container.querySelectorAll(CLASS_NAMES.item.class).forEach((item) => {
      container.appendChild(item);
    });
    container.querySelectorAll(CLASS_NAMES.page.class).forEach((page) => {
      const removedPage = container.removeChild(page);
      removedPage.destroy();
    });
  }

  private renderItems(container: Group) {
    const {
      style: { click, mouseenter, mouseleave },
    } = this.attributes;
    this.flattenPage(container);
    const dispatchCustomEvent = this.dispatchCustomEvent.bind(this);

    select(container)
      .selectAll(CLASS_NAMES.item.class)
      .data(this.renderData, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append(({ style }) => new CategoryItem({ style }))
            .attr('className', CLASS_NAMES.item.name)
            .on('click', function () {
              click?.(this);
              dispatchCustomEvent('itemClick', { item: this });
            })
            .on('mouseenter', function () {
              mouseenter?.(this);
              dispatchCustomEvent('itemMouseenter', { item: this });
            })
            .on('mouseleave', function () {
              mouseleave?.(this);
              dispatchCustomEvent('itemMouseleave', { item: this });
            }),
        (update) =>
          update.each(function ({ style }) {
            this.update(style);
          }),
        (exit) => exit.remove()
      );
  }

  private relayoutNavigator() {
    const {
      style: { layout, width },
    } = this.attributes;
    const height = (this.pageViews.children[0] as Group)?.getBBox().height || 0;
    const [navWidth, navHeight] = this.navigatorShape;

    this.navigator.update({
      style: layout === 'grid' ? { pageWidth: width! - navWidth, pageHeight: height - navHeight } : {},
    });
  }

  private adjustLayout() {
    const itemsLayouts = Object.entries(groupBy(this.itemsLayout, 'page')).map(([page, layouts]) => ({
      page,
      layouts,
    }));
    const categoryItems = [...this.navigator.getContainer().children] as CategoryItem[];

    itemsLayouts.forEach(({ layouts }) => {
      const page = this.pageViews.appendChild(new Group({ className: CLASS_NAMES.page.name }));
      layouts.forEach((layout) => {
        const { x, y, index, width, height } = layout;
        const item = categoryItems[index];
        // @ts-ignore
        page.appendChild(item);
        set(item, '__layout__', layout);
        item.update({ style: { x, y, width, height } });
      });
    });
    this.relayoutNavigator();
  }

  private renderNavigator(container: Selection) {
    const {
      style: { orientation },
    } = this.attributes;
    const navStyle = subStyleProps(this.attributes, 'nav');

    const style = deepAssign({ style: { orientation } }, navStyle);
    this.navigator = container
      .maybeAppendByClassName(CLASS_NAMES.navigator, () => new Navigator({}))
      .update(style)
      .node();
    return this.navigator;
  }

  public getBBox(): DOMRect {
    return this.navigator.getBBox();
  }

  render(attributes: Required<CategoryItemsStyleProps>, container: Group) {
    const { data } = this.attributes;
    if (!data || data.length === 0) return;
    /**
     * 1. render items
     * 2. paging
     * 3. layout
     */
    const navigator = this.renderNavigator(select(container));

    this.renderItems(navigator.getContainer());
    this.adjustLayout();
  }

  private dispatchCustomEvent(type: string, payload: any) {
    const evt = new CustomEvent(type, {
      detail: payload,
    });
    this.dispatchEvent(evt as any);
  }
}
