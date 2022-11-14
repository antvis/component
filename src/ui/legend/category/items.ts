import type { DisplayObject, DisplayObjectConfig, GroupStyleProps } from '@antv/g';
import { Group } from '@antv/g';
import { memoize, noop } from '@antv/util';
import { GUI } from '../../../core/gui';
import type { CallbackableObject, CallbackParameter, PrefixedStyle } from '../../../types';
import {
  applyStyle,
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
import type { CategoryItemData, CategoryItemStyle, CategoryItemStyleProps } from './item';
import { CategoryItem } from './item';

interface CategoryItemsDatum extends CategoryItemData {
  [keys: string]: any;
}

interface CategoryItemsCfg {
  orient: 'horizontal' | 'vertical';
  data: CategoryItemsDatum[];
  width?: number;
  height?: number;
  gridRow?: number;
  gridCol?: number;
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

type CategoryData = {
  id: string;
  page: number;
  row: number;
  col: number;
  index: number;
  style: Omit<CategoryItemStyleProps, 'width' | 'height'>;
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
  // width: 200,
  height: 50,
  data: [],
  // default is single row layout
  gridRow: 1,
  // gridCol: 5,
  padding: 0,
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

  private items: CategoryItem[][] = [];

  private pageViews = new Group({ className: CLASS_NAMES.pageView.class });

  private get attrs() {
    return filterTransform(this.attributes) as CategoryItemsStyleProps;
  }

  private get calcItemShapeType() {
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
          label,
          value,
          ...Object.fromEntries(
            Object.entries(style).map(([key, val]) => [
              key,
              key === 'marker' ? val : getCallbackValue(val, [datum, index, data]),
            ])
          ),
        },
        ...this.getItemLayout(index),
      };
    });

    return Object.entries(groupBy(d, 'page')).map(([page, items]) => ({
      page,
      items,
    }));
  }

  private getItemLayout(index: number): { page: number; row: number; col: number } {
    const { orient } = this.attrs;
    const [gridRow, gridCol] = this.grid;
    const _ = memoize(
      (i: number) => {
        const pageSize = gridCol * gridRow;
        const page = Math.floor(i / pageSize);
        const pageIndex = i % pageSize;
        const dir = this.ifHorizontal(gridCol, gridRow);
        const pos = [Math.floor(pageIndex / dir), pageIndex % dir];
        if (orient === 'vertical') pos.reverse();
        const [row, col] = pos;
        return { page, row, col };
      },
      (i) => [i, orient, gridRow, gridCol].join()
    );
    return _(index);
  }

  private ifHorizontal<T>(a: T, b: T): T {
    const { orient } = this.attrs;
    return ifHorizontal(orient, a, b);
  }

  private getItemShape(index: number): [number, number] {
    const { width, height, rowPadding, colPadding } = this.attrs as Required<CategoryItemsStyleProps>;
    const [gridRow, gridCol] = this.grid;
    if (this.calcItemShapeType === 'fixed') {
      const colWidth = (width - (gridCol - 1) * colPadding) / gridCol;
      const rowWidth = (height - (gridRow - 1) * rowPadding) / gridRow;
      return [colWidth, rowWidth];
    }
    const { page } = this.getItemLayout(index);
    const { width: itemWidth, height: itemHeight } = this.items[page][index].getBBox();
    return [itemWidth, itemHeight];
  }

  private renderItems() {
    const { click, mouseenter, mouseleave } = this.attrs;
    const itemEls = this.items;
    select(this.pageViews)
      .selectAll(CLASS_NAMES.itemPage.class)
      .data(this.renderData)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('className', CLASS_NAMES.itemPage.class)
            .each(function ({ items }, page) {
              select(this)
                .selectAll(CLASS_NAMES.item.class)
                .data(items)
                .join(
                  (enter) =>
                    enter
                      .append(({ style }) => {
                        const item = new CategoryItem({ style });
                        if (!itemEls[page]) itemEls[page] = [];
                        itemEls[page].push(item);
                        return item;
                      })
                      .attr('className', CLASS_NAMES.item.class)
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
            }),
        (update) =>
          update.each(function (datum) {
            this.update(datum);
          }),
        (exit) => exit.remove()
      );
  }

  private renderNavigator(container: Selection) {
    const { orient, width = 1000, height = 50 } = this.attrs;
    // console.log();

    const navStyle = getStyleFromPrefixed(this.attrs, 'nav');
    container.maybeAppendByClassName(
      CLASS_NAMES.navigator,
      () =>
        new Navigator({
          style: {
            ...navStyle,
            orient,
            pageWidth: width,
            pageHeight: height,
            pageViews: this.pageViews.children as DisplayObject[],
          },
        })
    );
  }

  private adjustLayout() {
    const { orient, colPadding = 0, rowPadding = 0 } = this.attrs;
    const [gridRow, gridCol] = this.grid;
    let prev = 0;
    const getItemStyle = ({ col, row }: CategoryData, index: number) => {
      const [width, height] = this.getItemShape(index);
      let [x, y] = [0, 0];
      if (orient === 'horizontal') {
        [x, y] = [prev, row * (height + rowPadding)];
        prev = col === gridCol - 1 ? 0 : prev + width + colPadding;
      } else {
        [x, y] = [col * (width + colPadding), prev];
        prev = row === gridRow - 1 ? 0 : prev + height + rowPadding;
      }
      return this.calcItemShapeType === 'fixed' ? { x, y, width, height } : { x, y };
    };

    this.items.forEach((page) => {
      page.forEach((item, index) => {
        // @ts-ignore
        select(item).call(applyStyle, getItemStyle(item.__data__, index));
      });
    });
  }

  render(attributes: Required<CategoryItemsStyleProps>, container: Group) {
    const ctn = select(container);
    this.renderItems();
    this.renderNavigator(ctn);
    this.adjustLayout();
  }
}
