import { IGroup } from '@antv/g-base/lib/interfaces';
import { each, filter, mix } from '@antv/util';
import { IList } from '../interfaces';
import { CategoryLegendCfg, LegendItemNameCfg, LegendMarkerCfg, ListItem } from '../types';
import { getStatesStyle } from '../util/state';
import Theme from '../util/theme';
import LegendBase from './base';

class Category extends LegendBase<CategoryLegendCfg> implements IList {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'legend',
      type: 'category',
      itemSpacing: 24,
      itemWidth: null,
      itemHeight: null,
      itemName: {},
      itemValue: null,
      maxWidth: null,
      maxHeight: null,
      marker: {},
      items: [],
      itemStates: {},
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
              fontWeight: 500,
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
    const itemGroup = this.addGroup(group, {
      id: this.getElementId('item-group'),
      name: 'legend-item-group',
    });
    const itemHeight = this.getItemHeight();
    const itemWidth = this.get('itemWidth');
    const itemSpacing = this.get('itemSpacing');
    const currentPoint = this.get('currentPoint');
    const startX = currentPoint.x;
    const layout = this.get('layout');
    const items = this.get('items');

    const maxWidth = this.get('maxWidth'); // 最大宽度，会导致 layout : 'horizontal' 时自动换行
    // const maxHeight = this.get('maxHeight'); // 最大高度，会导致出现分页
    // 暂时不考虑分页
    each(items, (item, index) => {
      const subGroup = this.drawItem(item, index, itemHeight, itemGroup);
      const bbox = subGroup.getBBox();
      const width = itemWidth || bbox.width;
      if (layout === 'horizontal') {
        // 如果水平布局
        if (maxWidth && maxWidth <= currentPoint.x + width) {
          // 检测是否换行
          currentPoint.x = startX;
          currentPoint.y += itemHeight;
        }
        this.moveElementTo(subGroup, currentPoint);
        currentPoint.x += width + itemSpacing;
      } else {
        // 如果垂直布局
        this.moveElementTo(subGroup, currentPoint);
        currentPoint.y += itemHeight; // itemSpacing 仅影响水平间距
      }
    });
  }
  // 获取图例项的高度，如果未定义，则按照 name 的高度计算
  private getItemHeight() {
    let itemHeight = this.get('itemHeight');
    if (!itemHeight) {
      const nameCfg = this.get('itemName');
      if (nameCfg) {
        itemHeight = nameCfg.style.fontSize + 8;
      }
    }
    return itemHeight;
  }
  // 绘制 marker
  private drawMarker(container: IGroup, markerCfg: LegendMarkerCfg, item: ListItem, itemHeight: number) {
    const markerAttrs = mix(
      {
        x: 0,
        y: itemHeight / 2,
      },
      markerCfg.style,
      item.marker
    );
    const shape = this.addShape(container, {
      type: 'marker',
      id: this.getElementId(`item-${item.id}-marker`),
      name: 'legend-item-marker',
      attrs: markerAttrs,
    });
    const bbox = shape.getBBox();
    shape.attr('x', bbox.width / 2); // marker 需要左对齐，所以不能占用左侧的空间
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

  // 获取当图例项存在状态时的元素样式，考虑存在多个样式
  // private getItemElementStatesStyle(item: ListItem, elementName: string, states: string[]) {
  //   const itemStates = this.get('itemStates');
  //   const styleName = `${elementName}Style`; // activeStyle
  //   let styles = null;
  //   each(states, (state) => {
  //     if (item[state] && itemStates[state]) {
  //       // item.active === true
  //       const stateStyle = itemStates[state][styleName];
  //       if (!styles) {
  //         styles = {};
  //       }
  //       mix(styles, stateStyle); // 合并样式
  //     }
  //   });
  //   return styles;
  // }

  // 绘制图例项
  private drawItem(item: ListItem, index: number, itemHeight: number, itemGroup: IGroup) {
    const groupId = `item-${item.id}`;
    const subGroup = this.addGroup(itemGroup, {
      name: 'legend-item',
      id: this.getElementId(groupId),
      delegationObject: {
        item,
        index,
      },
    });
    const marker = this.get('marker');
    const itemName = this.get('itemName');
    const itemValue = this.get('itemValue');

    let curX = 0; // 记录当前 x 的位置
    if (marker) {
      const markerShape = this.drawMarker(subGroup, marker, item, itemHeight);
      curX = markerShape.getBBox().maxX + marker.spacing;
    }
    if (itemName) {
      const nameShape = this.drawItemText(subGroup, 'name', itemName, item, itemHeight, curX, index);
      curX = nameShape.getBBox().maxX + itemName.spacing;
    }
    if (itemValue) {
      const valueShape = this.drawItemText(subGroup, 'value', itemValue, item, itemHeight, curX, index);
      const itemWidth = this.get('itemWidth');
      if (itemWidth && itemValue.alignRight) {
        // 当文本右对齐，同时制定了列宽度时，调整文本位置和对齐方式
        valueShape.attr({
          textAlign: 'right',
          x: itemWidth,
        });
      } // 如果考虑 value 和 name 的覆盖，这个地方需要做文本自动省略的功能
    }
    this.applyItemStates(item, subGroup);
    return subGroup;
  }

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
        }
      });
    }
  }
}

export default Category;
