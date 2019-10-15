import {Point} from '@antv/g-base/lib/types';

export interface ListItem{
  /**
   * 唯一值，用于动画或者查找
   * @type {string}
   */
  id?: string;
  /**
   * 名称
   * @type {string}
   */
  name: string;
  /**
   * 值
   * @type {any}
   */
  value: any;
  /**
   * 图形标记
   * @type {object}
   */
  marker?: object;
  [key: string]: any;
}

export interface GridItem{
  /**
   * 唯一值，用于动画或者查找
   * @type {string}
   */
  id?: string;
  /**
   * 栅格线的点集合
   * @type {Point[]}
   */
  points: Point[];
  [key: string]: any;
}