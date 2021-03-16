import { IGroup } from '@antv/g-base';
import { clamp, deepMix, each, filter, get, mix } from '@antv/util';
import { IList } from '../interfaces';
import { CategoryLegendCfg, LegendPageNavigatorCfg, LegendItemNameCfg, LegendMarkerCfg, ListItem } from '../types';
import { ellipsisLabel } from '../util/label';
import { getMatrixByAngle, getMatrixByTranslate } from '../util/matrix';
import { getStatesStyle } from '../util/state';
import Theme from '../util/theme';
import LegendBase from './base';

/**
 * 分页器 默认配置
 */
const DEFAULT_PAGE_NAVIGATOR = {
  marker: {
    style: {
      inactiveFill: '#000',
      inactiveOpacity: 0.45,
      fill: '#000',
      opacity: 1,
      size: 12,
    },
  },
  text: {
    style: {
      fill: '#ccc',
      fontSize: 12,
    },
  },
};

class Category extends LegendBase<CategoryLegendCfg> implements IList {
  private currentPageIndex = 1;
  private totalPagesCnt = 1;
  private pageWidth = 0;
  private pageHeight = 0;
  private startX = 0;
  private startY = 0;

  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'legend',
      type: 'category',
      itemSpacing: 24,
      itemMarginBottom: 8,
      maxItemWidth: null,
      itemWidth: null,
      itemHeight: null,
      itemName: {},
      itemValue: null,
      maxWidth: null,
      maxHeight: null,
      marker: {},
      items: [],
      itemStates: {},
      itemBackground: {},
      pageNavigator: {},
      defaultCfg: {
        title: {
          spacing: 5,
          style: {
            fill: Theme.textColor,
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'top',
          },
        },
        background: {
          padding: 5,
          style: {
            stroke: Theme.lineColor,
          },
        },
        itemBackground: {
          style: {
            opacity: 0,
            fill: '#fff',
          },
        },
        pageNavigator: DEFAULT_PAGE_NAVIGATOR,
        itemName: {
          spacing: 16, // 如果右边有 value 使用这个间距
          style: {
            fill: Theme.textColor,
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'middle',
          },
        },
        marker: {
          spacing: 8,
          style: {
            r: 6,
            symbol: 'circle',
          },
        },
        itemValue: {
          alignRight: false, // 只有itemWidth 不为 null 时此属性有效
          formatter: null,
          style: {
            fill: Theme.textColor,
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'middle',
          },
        },
        itemStates: {
          active: {
            nameStyle: {
              opacity: 0.8,
            },
          },
          unchecked: {
            nameStyle: {
              fill: Theme.uncheckedColor,
            },
            markerStyle: {
              fill: Theme.uncheckedColor,
              stroke: Theme.uncheckedColor,
            },
          },
          inactive: {
            nameStyle: {
              fill: Theme.uncheckedColor,
            },
            markerStyle: {
              opacity: 0.2,
            },
          },
        },
      },
    };
  }

  // 实现 IList 接口
  public isList(): boolean {
    return true;
  }

  /**
   * 获取图例项
   * @return {ListItem[]} 列表项集合
   */
  public getItems(): ListItem[] {
    return this.get('items');
  }

  /**
   * 设置列表项
   * @param {ListItem[]} items 列表项集合
   */
  public setItems(items: ListItem[]) {
    this.update({
      items,
    });
  }

  /**
   * 更新列表项
   * @param {ListItem} item 列表项
   * @param {object}   cfg  列表项
   */
  public updateItem(item: ListItem, cfg: object) {
    mix(item, cfg);
    this.clear(); // 由于单个图例项变化，会引起全局变化，所以全部更新
    this.render();
  }

  /**
   * 清空列表
   */
  public clearItems() {
    const itemGroup = this.getElementByLocalId('item-group');
    itemGroup && itemGroup.clear();
  }

  /**
   * 设置列表项的状态
   * @param {ListItem} item  列表项
   * @param {string}   state 状态名
   * @param {boolean}  value 状态值, true, false
   */
  public setItemState(item: ListItem, state: string, value: boolean) {
    item[state] = value;
    const itemElement = this.getElementByLocalId(`item-${item.id}`);
    if (itemElement) {
      const items = this.getItems();
      const index = items.indexOf(item);
      const offsetGroup = this.createOffScreenGroup(); // 离屏的 group
      const newElement = this.drawItem(item, index, this.getItemHeight(), offsetGroup);
      this.updateElements(newElement, itemElement); // 更新整个分组
      this.clearUpdateStatus(itemElement); // 清理更新状态，防止出现 bug
    }
  }
  /**
   * 是否存在指定的状态
   * @param {ListItem} item  列表项
   * @param {boolean} state 状态名
   */
  public hasState(item: ListItem, state: string): boolean {
    return !!item[state];
  }

  public getItemStates(item: ListItem): string[] {
    const itemStates = this.get('itemStates');
    const rst = [];
    each(itemStates, (v, k) => {
      if (item[k]) {
        // item.selected
        rst.push(k);
      }
    });
    return rst;
  }

  /**
   * 清楚所有列表项的状态
   * @param {string} state 状态值
   */
  public clearItemsState(state: string) {
    const items = this.getItemsByState(state);
    each(items, (item) => {
      this.setItemState(item, state, false);
    });
  }

  /**
   * 根据状态获取图例项
   * @param  {string}     state [description]
   * @return {ListItem[]}       [description]
   */
  public getItemsByState(state: string): ListItem[] {
    const items = this.getItems();
    return filter(items, (item) => {
      return this.hasState(item, state);
    });
  }

  // 绘制 legend 的选项
  protected drawLegendContent(group) {
    this.processItems();
    this.drawItems(group);
  }

  // 防止未设置 id
  private processItems() {
    const items = this.get('items');
    each(items, (item) => {
      if (!item.id) {
        // 如果没有设置 id，默认使用 name
        item.id = item.name;
      }
    });
  }

  // 绘制所有的图例选项
  private drawItems(group: IGroup) {
    const itemContainerGroup = this.addGroup(group, {
      id: this.getElementId('item-container-group'),
      name: 'legend-item-container-group',
    });
    const itemGroup = this.addGroup(itemContainerGroup, {
      id: this.getElementId('item-group'),
      name: 'legend-item-group',
    });
    const itemHeight = this.getItemHeight();
    const itemWidth = this.get('itemWidth');
    const itemSpacing = this.get('itemSpacing');
    const itemMarginBottom = this.get('itemMarginBottom');
    const currentPoint = this.get('currentPoint');
    const startX = currentPoint.x;
    const startY = currentPoint.y;
    const layout = this.get('layout');
    const items = this.get('items');
    let wrapped = false;
    let pageWidth = 0;

    const maxWidth = this.get('maxWidth'); // 最大宽度，会导致 layout : 'horizontal' 时自动换行
    const maxHeight = this.get('maxHeight'); // 最大高度，会导致出现分页
    // 暂时不考虑分页
    each(items, (item, index) => {
      const subGroup = this.drawItem(item, index, itemHeight, itemGroup);
      const bbox = subGroup.getBBox();
      const width = itemWidth || bbox.width;
      if (width > pageWidth) {
        pageWidth = width;
      }
      if (layout === 'horizontal') {
        // 如果水平布局
        if (maxWidth && maxWidth < currentPoint.x + width - startX) {
          // 检测是否换行
          wrapped = true;
          currentPoint.x = startX;
          currentPoint.y += itemHeight + itemMarginBottom;
        }
        this.moveElementTo(subGroup, currentPoint);
        currentPoint.x += width + itemSpacing;
      } else {
        // 如果垂直布局
        if (maxHeight && maxHeight < currentPoint.y + itemHeight + itemMarginBottom - startY) {
          // 换行
          wrapped = true;
          currentPoint.x += pageWidth + itemSpacing;
          currentPoint.y = startY;
          pageWidth = 0;
        }
        this.moveElementTo(subGroup, currentPoint);
        currentPoint.y += itemHeight + itemMarginBottom; // itemSpacing 仅影响水平间距
      }
    });

    if (wrapped && this.get('flipPage')) {
      this.pageHeight = 0;
      this.pageWidth = 0;
      this.totalPagesCnt = 1;
      this.startX = startX;
      this.startY = startY;
      this.adjustNavigation(group, itemGroup);
    }
  }
  // 获取图例项的高度，如果未定义，则按照 name 的高度计算
  private getItemHeight() {
    let itemHeight = this.get('itemHeight');
    if (!itemHeight) {
      const nameCfg = this.get('itemName');
      if (nameCfg) {
        itemHeight = nameCfg.style.fontSize;
      }
    }
    return itemHeight;
  }
  // 绘制 marker
  private drawMarker(container: IGroup, markerCfg: LegendMarkerCfg, item: ListItem, itemHeight: number) {
    const markerAttrs = {
      x: 0,
      y: itemHeight / 2,
      ...markerCfg.style,
      symbol: get(item.marker, 'symbol', 'circle'),
      ...get(item.marker, 'style', {}),
    };

    const shape = this.addShape(container, {
      type: 'marker',
      id: this.getElementId(`item-${item.id}-marker`),
      name: 'legend-item-marker',
      attrs: markerAttrs,
    });
    const bbox = shape.getBBox();
    shape.attr('x', bbox.width / 2); // marker 需要左对齐，所以不能占用左侧的空间

    const { stroke, fill } = shape.attr();
    if (stroke) {
      shape.set('isStroke', true);
    }
    if (fill) {
      shape.set('isFill', true);
    }

    return shape;
  }
  // 绘制文本
  private drawItemText(
    container: IGroup,
    textName: string,
    cfg: LegendItemNameCfg,
    item: ListItem,
    itemHeight: number,
    xPosition: number,
    index: number
  ) {
    const formatter = cfg.formatter;
    const attrs = {
      x: xPosition,
      y: itemHeight / 2,
      text: formatter ? formatter(item[textName], item, index) : item[textName],
      ...cfg.style,
    };
    return this.addShape(container, {
      type: 'text',
      id: this.getElementId(`item-${item.id}-${textName}`),
      name: `legend-item-${textName}`,
      attrs,
    });
  }

  // 绘制图例项
  private drawItem(item: ListItem, index: number, itemHeight: number, itemGroup: IGroup) {
    const groupId = `item-${item.id}`;
    // 设置单独的 Group 用于 setClip
    const subContainer = this.addGroup(itemGroup, {
      name: 'legend-item-container',
      id: this.getElementId(`item-container-${groupId}`),
      delegateObject: {
        item,
        index,
      },
    });
    const subGroup = this.addGroup(subContainer, {
      name: 'legend-item',
      id: this.getElementId(groupId),
      delegateObject: {
        item,
        index,
      },
    });
    const marker = this.get('marker');
    const itemName = this.get('itemName');
    const itemValue = this.get('itemValue');
    const itemBackground = this.get('itemBackground');
    const itemWidth = this.getLimitItemWidth();

    let curX = 0; // 记录当前 x 的位置
    if (marker) {
      const markerShape = this.drawMarker(subGroup, marker, item, itemHeight);
      curX = markerShape.getBBox().maxX + marker.spacing;
    }

    if (itemName) {
      const nameShape = this.drawItemText(subGroup, 'name', itemName, item, itemHeight, curX, index);
      if (itemWidth) {
        // 设置了 item 的最大宽度限制，并且超出了，进行省略处理
        ellipsisLabel(true, nameShape, clamp(itemWidth - curX, 0, itemWidth));
      }
      curX = nameShape.getBBox().maxX + itemName.spacing;
    }
    if (itemValue) {
      const valueShape = this.drawItemText(subGroup, 'value', itemValue, item, itemHeight, curX, index);
      if (itemWidth) {
        if (itemValue.alignRight) {
          valueShape.attr({
            textAlign: 'right',
            x: itemWidth,
          });
          ellipsisLabel(true, valueShape, clamp(itemWidth - curX, 0, itemWidth), 'head');
        } else {
          ellipsisLabel(true, valueShape, clamp(itemWidth - curX, 0, itemWidth));
        }
      }
    }
    // 添加透明的背景，便于拾取和包围盒计算
    if (itemBackground) {
      const bbox = subGroup.getBBox();
      const backShape = this.addShape(subGroup, {
        type: 'rect',
        name: 'legend-item-background',
        id: this.getElementId(`${groupId}-background`),
        attrs: {
          x: 0,
          y: 0,
          width: bbox.width,
          height: itemHeight,
          ...itemBackground.style,
        },
      });
      backShape.toBack();
    }

    this.applyItemStates(item, subGroup);
    return subGroup;
  }

  // 加上分页器并重新排序 items
  private adjustNavigation(container: IGroup, itemGroup: IGroup) {
    const startX = this.startX;
    const startY = this.startY;
    const layout = this.get('layout');
    const subGroups = itemGroup.findAll((item) => item.get('name') === 'legend-item');
    const maxWidth = this.get('maxWidth');
    const maxHeight = this.get('maxHeight');
    const itemWidth = this.get('itemWidth');
    const itemSpacing = this.get('itemSpacing');
    const itemHeight = this.getItemHeight();
    const pageNavigator: LegendPageNavigatorCfg = deepMix({}, DEFAULT_PAGE_NAVIGATOR, this.get('pageNavigator'));
    const navigation = this.drawNavigation(container, layout, '00/00', pageNavigator);
    const navigationBBox = navigation.getBBox();
    const currentPoint = { x: startX, y: startY };
    let pages = 1;
    let widthLimit = 0;
    let pageWidth = 0;
    let maxItemWidth = 0;

    if (layout === 'horizontal') {
      this.pageHeight = itemHeight;
      each(subGroups, (item) => {
        const bbox = item.getBBox();
        const width = itemWidth || bbox.width;
        if (
          (widthLimit && widthLimit < currentPoint.x + width + itemSpacing) ||
          maxWidth < currentPoint.x + width + itemSpacing + navigationBBox.width
        ) {
          if (pages === 1) {
            widthLimit = currentPoint.x + itemSpacing;
            this.pageWidth = widthLimit;
            this.moveElementTo(navigation, {
              x: maxWidth - itemSpacing - navigationBBox.width - navigationBBox.minX,
              y: currentPoint.y + itemHeight / 2 - navigationBBox.height / 2 - navigationBBox.minY,
            });
          }
          pages += 1;
          currentPoint.x = startX;
          currentPoint.y += itemHeight;
        }
        this.moveElementTo(item, currentPoint);
        item.getParent().setClip({
          type: 'rect',
          attrs: {
            x: currentPoint.x,
            y: currentPoint.y,
            width: width + itemSpacing,
            height: itemHeight,
          },
        });
        currentPoint.x += width + itemSpacing;
      });
    } else {
      const itemMarginBottom = this.get('itemMarginBottom');
      each(subGroups, (item) => {
        const bbox = item.getBBox();
        if (bbox.width > pageWidth) {
          pageWidth = bbox.width;
        }
      });
      maxItemWidth = pageWidth;
      pageWidth += itemSpacing;
      if (maxWidth) {
        // maxWidth 限制加上
        pageWidth = Math.min(maxWidth, pageWidth);
        maxItemWidth = Math.min(maxWidth, maxItemWidth);
      }
      this.pageWidth = pageWidth;
      this.pageHeight = maxHeight - Math.max(navigationBBox.height, itemHeight + itemMarginBottom);
      const cntPerPage = Math.floor(this.pageHeight / (itemHeight + itemMarginBottom));
      each(subGroups, (item, index) => {
        if (index !== 0 && index % cntPerPage === 0) {
          pages += 1;
          currentPoint.x += pageWidth;
          currentPoint.y = startY;
        }
        this.moveElementTo(item, currentPoint);
        item.getParent().setClip({
          type: 'rect',
          attrs: {
            x: currentPoint.x,
            y: currentPoint.y,
            width: pageWidth,
            height: itemHeight,
          },
        });
        currentPoint.y += itemHeight + itemMarginBottom;
      });
      this.totalPagesCnt = pages;
      this.moveElementTo(navigation, {
        x: startX + maxItemWidth / 2 - navigationBBox.width / 2 - navigationBBox.minX,
        y: maxHeight - navigationBBox.height - navigationBBox.minY,
      });
    }

    if (this.pageHeight && this.pageWidth) {
      // 为了使固定的 clip 生效，clip 设置在 itemContainerGroup 上，itemGroup 需要在翻页时会设置 matrix
      itemGroup.getParent().setClip({
        type: 'rect',
        attrs: {
          x: this.startX,
          y: this.startY,
          width: this.pageWidth,
          height: this.pageHeight,
        },
      });
    }

    this.totalPagesCnt = pages;
    if (this.currentPageIndex > this.totalPagesCnt) {
      this.currentPageIndex = 1;
    }
    this.updateNavigation(navigation);
    // update initial matrix
    itemGroup.attr('matrix', this.getCurrentNavigationMatrix());
  }

  /**
   * 绘制分页器
   */
  private drawNavigation(
    group: IGroup,
    layout: 'horizontal' | 'vertical',
    text: string,
    styleCfg?: LegendPageNavigatorCfg
  ) {
    const currentPoint = { x: 0, y: 0 };
    const subGroup = this.addGroup(group, {
      id: this.getElementId('navigation-group'),
      name: 'legend-navigation',
    });
    const { size = 12, ...arrowStyle } = get(styleCfg.marker, 'style', {});
    const leftArrow = this.drawArrow(
      subGroup,
      currentPoint,
      'navigation-arrow-left',
      layout === 'horizontal' ? 'up' : 'left',
      size,
      arrowStyle
    );
    leftArrow.on('click', this.onNavigationBack);
    const leftArrowBBox = leftArrow.getBBox();
    currentPoint.x += leftArrowBBox.width + 2;

    const textShape = this.addShape(subGroup, {
      type: 'text',
      id: this.getElementId('navigation-text'),
      name: 'navigation-text',
      attrs: {
        x: currentPoint.x,
        y: currentPoint.y + size / 2,
        text,
        textBaseline: 'middle',
        ...get(styleCfg.text, 'style'),
      },
    });
    const textBBox = textShape.getBBox();
    currentPoint.x += textBBox.width + 2;

    const rightArrow = this.drawArrow(
      subGroup,
      currentPoint,
      'navigation-arrow-right',
      layout === 'horizontal' ? 'down' : 'right',
      size,
      arrowStyle
    );
    rightArrow.on('click', this.onNavigationAfter);

    return subGroup;
  }

  private updateNavigation(navigation?: IGroup) {
    const pageNavigator: LegendPageNavigatorCfg = deepMix({}, DEFAULT_PAGE_NAVIGATOR, this.get('pageNavigator'));
    const { fill, opacity, inactiveFill, inactiveOpacity } = pageNavigator.marker.style;

    const text = `${this.currentPageIndex}/${this.totalPagesCnt}`;
    const textShape = navigation ? navigation.getChildren()[1] : this.getElementByLocalId('navigation-text');
    const leftArrow = navigation
      ? navigation.findById(this.getElementId('navigation-arrow-left'))
      : this.getElementByLocalId('navigation-arrow-left');
    const rightArrow = navigation
      ? navigation.findById(this.getElementId('navigation-arrow-right'))
      : this.getElementByLocalId('navigation-arrow-right');
    const origBBox = textShape.getBBox();
    textShape.attr('text', text);
    const newBBox = textShape.getBBox();
    textShape.attr('x', textShape.attr('x') - (newBBox.width - origBBox.width) / 2);
    // 更新 left-arrow marker
    leftArrow.attr('opacity', this.currentPageIndex === 1 ? inactiveOpacity : opacity);
    leftArrow.attr('fill', this.currentPageIndex === 1 ? inactiveFill : fill);
    leftArrow.attr('cursor', this.currentPageIndex === 1 ? 'not-allowed' : 'pointer');
    // 更新 right-arrow marker
    rightArrow.attr('opacity', this.currentPageIndex === this.totalPagesCnt ? inactiveOpacity : opacity);
    rightArrow.attr('fill', this.currentPageIndex === this.totalPagesCnt ? inactiveFill : fill);
    rightArrow.attr('cursor', this.currentPageIndex === this.totalPagesCnt ? 'not-allowed' : 'pointer');
  }

  private drawArrow(
    group: IGroup,
    currentPoint: { x: number; y: number },
    name: string,
    direction: 'left' | 'right' | 'up' | 'down',
    size: number,
    style?: LegendPageNavigatorCfg['marker']['style']
  ) {
    const { x, y } = currentPoint;
    const rotateMap = {
      right: (90 * Math.PI) / 180,
      left: ((360 - 90) * Math.PI) / 180,
      up: 0,
      down: (180 * Math.PI) / 180,
    };
    const shape = this.addShape(group, {
      type: 'path',
      id: this.getElementId(name),
      name,
      attrs: {
        path: [['M', x + size / 2, y], ['L', x, y + size], ['L', x + size, y + size], ['Z']],
        cursor: 'pointer',
        ...style,
      },
    });
    shape.attr('matrix', getMatrixByAngle({ x: x + size / 2, y: y + size / 2 }, rotateMap[direction]));

    return shape;
  }

  private getCurrentNavigationMatrix() {
    const { currentPageIndex, pageWidth, pageHeight } = this;
    const layout = this.get('layout');
    const translate =
      layout === 'horizontal'
        ? {
            x: 0,
            y: pageHeight * (1 - currentPageIndex),
          }
        : {
            x: pageWidth * (1 - currentPageIndex),
            y: 0,
          };

    return getMatrixByTranslate(translate);
  }

  private onNavigationBack = () => {
    const itemGroup = this.getElementByLocalId('item-group');
    if (this.currentPageIndex > 1) {
      this.currentPageIndex -= 1;
      this.updateNavigation();
      const matrix = this.getCurrentNavigationMatrix();
      if (this.get('animate')) {
        itemGroup.animate(
          {
            matrix,
          },
          100
        );
      } else {
        itemGroup.attr({ matrix });
      }
    }
  };

  private onNavigationAfter = () => {
    const itemGroup = this.getElementByLocalId('item-group');
    if (this.currentPageIndex < this.totalPagesCnt) {
      this.currentPageIndex += 1;
      this.updateNavigation();
      const matrix = this.getCurrentNavigationMatrix();
      if (this.get('animate')) {
        itemGroup.animate(
          {
            matrix,
          },
          100
        );
      } else {
        itemGroup.attr({ matrix });
      }
    }
  };

  // 附加状态对应的样式
  private applyItemStates(item: ListItem, subGroup: IGroup) {
    const states = this.getItemStates(item);
    const hasStates = states.length > 0;
    if (hasStates) {
      const children = subGroup.getChildren();
      const itemStates = this.get('itemStates');
      each(children, (element) => {
        const name = element.get('name');
        const elName = name.split('-')[2]; // marker, name, value
        const statesStyle = getStatesStyle(item, elName, itemStates);
        if (statesStyle) {
          element.attr(statesStyle);
          if (elName === 'marker' && !(element.get('isStroke') && element.get('isFill'))) {
            // 如果 marker 是单填充或者单描边的话，就不要额外添加 stroke 或这 fill 属性，否则会影响 unchecked 后的显示
            if (element.get('isStroke')) {
              element.attr('fill', null);
            }
            if (element.get('isFill')) {
              element.attr('stroke', null);
            }
          }
        }
      });
    }
  }

  // 获取 itemWidth 的最终设置
  private getLimitItemWidth() {
    const itemWidth = this.get('itemWidth');
    let maxItemWidth = this.get('maxItemWidth');

    if (maxItemWidth) {
      // 设置了最大宽度
      if (itemWidth) {
        maxItemWidth = itemWidth <= maxItemWidth ? itemWidth : maxItemWidth;
      }
    } else if (itemWidth) {
      maxItemWidth = itemWidth;
    }

    return maxItemWidth;
  }
}

export default Category;
