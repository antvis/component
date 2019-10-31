import { IGroup } from '@antv/g-base/lib/interfaces';
import { each, mix } from '@antv/util';
import { CategoryLegendCfg, LegendItemNameCfg, LegendMarkerCfg, ListItem } from '../types';
import Theme from '../util/theme';
import LegendBase from './base';

class Category extends LegendBase<CategoryLegendCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'legend',
      type: 'category',
      itemSpacing: 10,
      itemWidth: null,
      itemHeight: null,
      itemName: {},
      itemValue: null,
      maxWidth: null,
      maxHeight: null,
      marker: {},
      items: [],
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
          spacing: 5, // 如果右边有 value 使用这个间距
          style: {
            fill: Theme.textColor,
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'middle',
          },
        },
        marker: {
          spacing: 5,
          style: {
            r: 5,
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
        itemState: {
          active: {},
          unchecked: {},
        },
      },
    };
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
  // 绘制图例项
  private drawItem(item: ListItem, index: number, itemHeight: number, itemGroup: IGroup) {
    const groupId = `item-${item.id}`;
    const subGroup = this.addGroup(itemGroup, {
      name: 'legend-item',
      id: this.getElementId(groupId),
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

    return subGroup;
  }
}

export default Category;
