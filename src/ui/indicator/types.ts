import type { PathStyleProps, TextStyleProps, GroupStyleProps } from '@antv/g';
import type { ExtendDisplayObject, PrefixedStyle } from '../../types';
import type { SeriesAttr } from '../../util';

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type IndicatorStyle = PrefixedStyle<PathStyleProps, 'background'> & PrefixedStyle<TextStyleProps, 'label'>;
export type IndicatorCfg<T = any> = {
  value?: T;
  /** position of indicator related to pointer  */
  position?: Position;
  padding?: SeriesAttr;
  formatter?: (val: T) => ExtendDisplayObject;
};

export type IndicatorStyleProps<T = any> = GroupStyleProps & IndicatorStyle & IndicatorCfg<T>;
