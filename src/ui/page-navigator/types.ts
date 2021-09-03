import type { ButtonCfg } from '../button';
import type { DisplayObject } from '../../types';
import { ShapeAttrs, DisplayObjectConfig } from '../../types';

export type Effect = string;
export type PaginationPosition = 'top' | 'bottom' | 'left' | 'right';
export type ButtonPosition = PaginationPosition | 'top-bottom' | 'left-right';

export interface PageNavigatorCfg extends ShapeAttrs {
  x?: number;
  y?: number;
  /**
   * 待分页的对象
   */
  view: DisplayObject;
  /**
   * 手动指定画布宽度
   */
  width?: number;
  /**
   * 手动指定画布高度
   */
  height?: number;
  /**
   * 页宽
   */
  pageWidth: number;
  /**
   * 页高
   */
  pageHeight: number;
  /**
   * 翻页效果
   */
  effect?: Effect;
  /**
   * 翻页动画耗时
   */
  duration?: number;
  /**
   * 分页方向
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * 初始化页码
   */
  initPageNum?: number;
  /**
   * 页码限制
   * 如果不设置则自动计算，指定后只能在前几页翻页
   * 使用回调方法时，需要配置该项
   */
  pageLimit?: number;
  /**
   * 循环翻页
   */
  loop?: boolean;
  /**
   * 自定义翻页
   * 根据页码拿到该页的位置
   */
  pageCallback?: (page: number) => {
    x: number;
    y: number;
  };
  /**
   * 翻页按钮配置
   */
  button?: {
    prev?: ButtonCfg;
    next?: ButtonCfg;
    spacing?: number;
    position?: ButtonPosition;
  };
  /**
   * 页码配置
   */
  pagination?: {
    type?: 'currTotal' | 'eachNum'; // 暂时没想好怎么命名，currTotal 表示 < 1/5 >  这种分页方式，eachNum 表示 < 1 2 3 4 5 > 这种形式
    style?: Pick<ButtonCfg, 'textStyle' | 'buttonStyle'>;
    separator?: string;
    spacing?: number;
    position?: PaginationPosition;
  };
}

export type PageNavigatorOptions = DisplayObjectConfig<PageNavigatorCfg>;
