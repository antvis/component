import type { DisplayObjectConfig, GroupStyleProps, RectStyleProps } from '@antv/g';
import type { PrefixedStyle } from '../../types';
import type { Padding } from '../../util';
import type { SliderStyleProps } from '../slider';

/**
 * 滚动条组件的属性配置
 */
export interface ScrollbarStyleProps
  extends GroupStyleProps,
    PrefixedStyle<RectStyleProps, 'track'>,
    PrefixedStyle<RectStyleProps, 'thumb'> {
  /**
   * 滑条朝向
   */
  orient?: SliderStyleProps['orient'];

  /**
   * 轨道长度，默认取 viewportLength
   */
  trackLength?: number;

  /**
   * 轨道宽度
   */
  trackSize?: number;

  /**
   * 滚动条的值
   */
  value?: number;

  /**
   * 滑块是否圆角
   */
  isRound?: boolean;

  /** 视图总长度 */
  contentLength: number;

  /** 显示区域长度 */
  viewportLength: number;

  /**
   * 滚动条内边距
   */
  padding?: Padding;

  /**
   * 是否可以拖动
   */
  slidable?: boolean;

  /**
   * 是否启用滚轮滚动
   */
  scrollable?: boolean;
}

/**
 * 滚动条组件的配置项
 */
export type ScrollbarOptions = DisplayObjectConfig<ScrollbarStyleProps>;
