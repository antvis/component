import type { GroupStyleProps } from '@antv/g';
import { DisplayObject, Group } from '@antv/g';
import { chain, noop } from 'lodash';
import {
  classNames,
  createComponent,
  getCallbackValue,
  getStylesFromPrefixed,
  Padding,
  select,
  filterTransform,
} from '../../../util';
import type { Callbackable, CallbackableObject, CallbackParameter, PrefixedStyle } from '../../../types';
import type { NavigatorStyleProps } from '../../navigator';
import { Navigator } from '../../navigator';
import { ifHorizontal } from '../utils';
import type { CategoryItemData, CategoryItemStyle, CategoryItemStyleProps } from './item';
import { CategoryItem } from './item';

interface CatoryItemsDatum extends CategoryItemData {
  [keys: string]: any;
}

interface CategoryItemsCfg {
  orient: 'horizontal' | 'vertical';
  data: CatoryItemsDatum[];
  width: number;
  height: number;
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
  CallbackParameter<CatoryItemsDatum>
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
  width: 200,
  height: 50,
  data: [],
  gridRow: 1,
  gridCol: 5,
  padding: 0,
  rowPadding: 0,
  colPadding: 0,
  orient: 'horizontal',
  click: noop,
  mouseenter: noop,
  mouseleave: noop,
};

function getItemShape(cfg: CategoryItemsStyleProps) {
  const { width, height, gridRow, gridCol, rowPadding, colPadding } = cfg as Required<CategoryItemsStyleProps>;
  const colWidth = (width - (gridCol - 1) * colPadding) / gridCol;
  const rowWidth = (height - (gridRow - 1) * rowPadding) / gridRow;
  return [colWidth, rowWidth];
}

function getItemsLayout(index: number, cfg: CategoryItemsStyleProps) {
  const { orient, gridRow, gridCol } = cfg as Required<CategoryItemsStyleProps>;

  const dir = ifHorizontal(orient, gridCol, gridRow);

  const pageSize = gridCol * gridRow;
  const page = Math.floor(index / pageSize);
  const pageIndex = index % pageSize;

  const pos = [Math.floor(pageIndex / dir), pageIndex % dir];
  if (orient === 'vertical') pos.reverse();

  const [row, col] = pos;
  return { page, row, col };
}

function getRenderData(
  data: CategoryItemsStyleProps['data'],
  cfg: CategoryItemsStyleProps,
  itemStyle: CallbackableItemStyle
): CategoryData[] {
  return data.map((datum, index) => ({
    id: datum.id || index.toString(),
    index,
    style: {
      label: datum.label,
      value: datum.value,
      ...Object.fromEntries(
        Object.entries(itemStyle).map(([key, val]) => [
          key,
          key === 'marker' ? val : getCallbackValue(val, [datum, index, data]),
        ])
      ),
    },
    ...getItemsLayout(index, cfg),
  }));
}

export const CategoryItems = createComponent<CategoryItemsStyleProps>(
  {
    render(attributes, container) {
      const {
        orient,
        data,
        width,
        height,
        gridRow,
        gridCol,
        padding,
        rowPadding,
        colPadding,
        click,
        mouseenter,
        mouseleave,
        ...restStyle
      } = filterTransform(attributes) as Required<CategoryItemsStyleProps>;

      const [navStyle, itemStyle] = getStylesFromPrefixed(restStyle, ['nav', 'item']);
      const renderData = Object.entries(chain(getRenderData(data, attributes, itemStyle)).groupBy('page').value()).map(
        ([page, items]) => ({ page, items })
      );
      const pageViews = new Group({ className: CLASS_NAMES.pageView.class });

      const [iW, iH] = getItemShape(attributes);
      const getItemStyle = ({ col, row, style }: CategoryData, index: number) => {
        const [x, y] = [col * (iW + colPadding), row * (iH + rowPadding)];
        return {
          x,
          y,
          width: iW,
          height: iH,
          ...style,
        };
      };

      select(pageViews)
        .selectAll(CLASS_NAMES.itemPage.class)
        .data(renderData)
        .join(
          (enter) =>
            enter
              .append('g')
              .attr('className', CLASS_NAMES.itemPage.class)
              .each(function ({ items }) {
                select(this)
                  .selectAll(CLASS_NAMES.item.class)
                  .data(items)
                  .join(
                    (enter) =>
                      enter
                        .append((datum, index) => new CategoryItem({ style: getItemStyle(datum, index) }))
                        .attr('className', CLASS_NAMES.item.class)
                        .on('click', function () {
                          click(this);
                        })
                        .on('mouseenter', function () {
                          mouseenter(this);
                        })
                        .on('mouseleave', function () {
                          mouseleave(this);
                        }),
                    (update) =>
                      update.each(function (datum, index) {
                        this.update(getItemStyle(datum, index));
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

      select(container).maybeAppendByClassName(
        CLASS_NAMES.navigator,
        () =>
          new Navigator({
            style: {
              ...navStyle,
              orient,
              pageWidth: width,
              pageHeight: height,
              pageViews: pageViews.children as DisplayObject[],
            },
          })
      );
    },
  },
  { ...CATEGORY_ITEMS_DEFAULT_CFG }
);
