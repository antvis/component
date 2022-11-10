import type { ExtendDisplayObject, PrefixedStyle } from '@/types';
import { Padding } from '@/util';
import type { PathStyleProps, TextStyleProps, GroupStyleProps } from '@antv/g';

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type IndicatorStyle = PrefixedStyle<PathStyleProps, 'background'> & PrefixedStyle<TextStyleProps, 'label'>;
export type IndicatorCfg<T = any> = {
  value?: T;
  /** position of indicator related to pointer  */
  position?: Position;
  padding?: Padding;
  formatter?: (val: T) => ExtendDisplayObject;
  onIndicate?: (val: T) => void;
};

export type IndicatorStyleProps<T = any> = GroupStyleProps & IndicatorStyle & IndicatorCfg<T>;
