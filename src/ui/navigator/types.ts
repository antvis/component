import type { DisplayObjectConfig, Group, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import { PrefixedStyle } from '../../types';

export interface NavigatorStyle
  extends Omit<RectStyleProps, 'width' | 'height'>,
    PrefixedStyle<PathStyleProps, 'button'>,
    PrefixedStyle<TextStyleProps, 'pageNum'> {}

export interface NavigatorCfg {
  pageWidth: number;
  pageHeight: number;
  effect?: string;
  duration?: number;
  orient?: 'horizontal' | 'vertical';
  initPage?: number;
  loop?: boolean;
  pageViews: Group[];
  /** padding between buttons and page number  */
  controllerPadding?: number;
  /** spacing between controller and page content */
  controllerSpacing?: number;
  formatter?: (curr: number, total: number) => string;
}

export type NavigatorStyleProps = NavigatorStyle & NavigatorCfg;

export type NavigatorOptions = DisplayObjectConfig<NavigatorStyleProps>;
