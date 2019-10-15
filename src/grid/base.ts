import {each, isString, mix} from '@antv/util';
import GroupComponent from '../abstract/group-component';
import {GridItem} from '../types';
import Theme from '../util/theme';

abstract class GridBase extends GroupComponent {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'grid',
      /**
       * 线的样式
       * @type {object}
       */
      line: {},
      /**
       * 两个栅格线间的填充色，必须是一个数组
       * @type {null|string|Array}
       */
      alternateColor: null,
      /**
       * 栅格线默认不能被拾取
       * @type {boolean}
       */
      capture: false,
      /**
       * 绘制 grid 需要的点的集合
       */
      items: [],
      /**
       * 栅格线是否封闭
       * @type {true}
       */
      closed: false,

      defaultCfg: {
        line: {
          type: 'line', // 对于 line 类型的 grid 有 line, smooth 两种，cirle 类型的 grid 有 line 和 circle
          style: {
            lineWidth: 1,
            stroke: Theme.lineColor
          }
        }
      }
    }
  }

  protected getLineType() {
    const line = this.get('line') || this.get('defaultCfg').line;
    return line.type;
  }

  protected renderInner(group) {
    this.drawGrid(group);
  }

  protected abstract getGridPath(points, reversed?: boolean): any[];

  protected getAlternatePath(prePoints, points) {
    let regionPath = this.getGridPath(prePoints);
    const reversePoints = points.slice(0).reverse();
    const nextPath = this.getGridPath(reversePoints, true);
    const closed = this.get('closed');
    if (closed) {
      regionPath = regionPath.concat(nextPath);
    } else {
      nextPath[0][0] = 'L'; // 更新第一个节点
      regionPath = regionPath.concat(nextPath);
      regionPath.push(['Z']);
    }
    return regionPath;
  }

  private getPathStyle() {
    return this.get('line').style;
  }

  private drawGrid(group) {
    const line = this.get('line');
    const items = this.get('items');
    const alternateColor = this.get('alternateColor');
    let preItem = null;
    each(items, (item, index) => {
      const id = item.id || index;
      // 绘制栅格线
      if (line) {
        const style = this.getPathStyle();
        const lineId = this.getElementId(`line-${id}`);
        const gridPath = this.getGridPath(item.points);
        this.addShape(group, {
          type: 'path',
          name: 'grid-line',
          id: lineId,
          attrs: mix({
            path: gridPath
          }, style)
        });
      }
      // 如果存在 alternateColor 则绘制矩形
      // 从第二个栅格线开始绘制
      if (alternateColor && index > 0) {
        const regionId = this.getElementId(`region-${id}`);
        const isEven = (index) % 2 === 0;
        if (isString(alternateColor)) { // 如果颜色是单值，则是仅绘制偶数时的区域
          if (isEven) {
            this.drawAlternateRegion(regionId, group, preItem.points, item.points, alternateColor);
          }
        } else {
          const color = isEven ? alternateColor[1] : alternateColor[0];
          this.drawAlternateRegion(regionId, group, preItem.points, item.points, color);
        }
      }
      preItem = item;
    });
  }

  private drawAlternateRegion(id, group, prePoints, points, color) {
    const regionPath = this.getAlternatePath(prePoints, points);
    this.addShape(group, {
      type: 'path',
      id,
      name: 'grid-region',
      attrs: {
        path: regionPath,
        fill: color
      }
    });
  }
}

export default GridBase;