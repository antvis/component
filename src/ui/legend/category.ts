import { Group } from '@antv/g';
import { min, isFunction, deepMix } from '@antv/util';
import { maybeAppend, normalPadding } from '../../util';
import { GUI } from '../../core/gui';
import { CategoryItem, CategoryItemStyleProps } from './categoryItem';
import type { CategoryStyleProps, CategoryOptions } from './types';
import { getTitleShapeBBox, renderGroup, renderRect, renderTitle } from './base';
import { CATEGORY_DEFAULT_OPTIONS, DEFAULT_ITEM_MARKER, DEFAULT_ITEM_NAME, DEFAULT_ITEM_VALUE } from './constant';
import { CategoryItems } from './categoryItems';

export type { CategoryOptions };

function getItems(attributes: any): CategoryItemStyleProps[] {
  const {
    items: _items,
    maxWidth,
    maxItemWidth,
    itemMarker,
    itemName,
    itemValue,
    reverse,
    itemWidth,
    itemHeight,
    itemPadding,
    itemBackgroundStyle,
  } = attributes;
  const items: any[] = _items.slice();
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
      itemWidth,
      itemHeight,
      padding: itemPadding,
      backgroundStyle: itemBackgroundStyle as any,
    };
  });
}

export class Category extends GUI<CategoryStyleProps> {
  constructor(config: any) {
    super(deepMix({}, CATEGORY_DEFAULT_OPTIONS, config));
  }

  public render(attributes: CategoryStyleProps, container: Group): void {
    const {
      padding,
      title,
      inset,
      orient = 'horizontal',
      spacing,
      autoWrap,
      maxRows,
      maxWidth,
      maxHeight,
      cols,
      pageNavigator,
      backgroundStyle = {},
    } = attributes;
    const [top, right, bottom, left] = normalPadding(padding);

    const group = renderGroup(container, 'legend-container', left, top);
    const titleShape = renderTitle(group, title);

    const titleSpacing = title?.spacing || 0;
    const [insetTop, , , insetLeft] = normalPadding(inset);
    const { left: tl, bottom: tb } = getTitleShapeBBox(titleShape);
    const innerGroup = renderGroup(group, 'legend-inner-group', tl + insetLeft, tb + insetTop + titleSpacing);

    maybeAppend(innerGroup, '.category-items', () => new CategoryItems({}))
      .attr('className', 'category-items')
      .call((selection) => {
        (selection.node() as CategoryItems).update({
          orient,
          items: getItems(attributes),
          spacing,
          autoWrap,
          maxRows,
          maxWidth,
          maxHeight,
          cols,
          ...(pageNavigator || {}),
        });
      })
      .node() as CategoryItems;

    const { min, max } = group.getLocalBounds();
    const w = max[0] - min[0];
    const h = max[1] - min[1];
    renderRect(
      container,
      'legend-background',
      Math.min(w + right + left, maxWidth || Number.MAX_VALUE),
      Math.min(h + top + bottom, maxHeight || Number.MAX_VALUE),
      backgroundStyle
    );
  }

  public getItem(id: string): CategoryItem | undefined {
    return this.querySelector(`[id=${id}]`) as CategoryItem | undefined;
  }

  public setItemState(id: string, state: string, enable = true): void {
    this.getItem(id)?.setState(state, enable);
  }

  public getItemsStates(): { id: string; state: string }[] {
    const items = this.querySelectorAll('.legend-item') as CategoryItem[];
    return items.map((item) => ({ id: item.id, state: item.getState() }));
  }
}
