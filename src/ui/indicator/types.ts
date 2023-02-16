import type { GroupStyleProps, PathStyleProps, TextStyleProps } from '@antv/g';
import type { ComponentOptions } from '../../core';
import type { ExtendDisplayObject, PrefixObject } from '../../types';
import type { SeriesAttr } from '../../util';

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type IndicatorStyleProps<T = any> = {
  formatter?: (val: T) => ExtendDisplayObject;
  style: GroupStyleProps &
    PrefixObject<PathStyleProps, 'background'> &
    PrefixObject<Omit<TextStyleProps, 'text'>, 'label'> & {
      labelText?: T;
      /** position of indicator related to pointer  */
      position?: Position;
      padding?: SeriesAttr;
    };
};

export type IndicatorOptions = ComponentOptions<IndicatorStyleProps>;
